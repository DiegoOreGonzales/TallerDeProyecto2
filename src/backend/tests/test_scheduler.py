"""
Suite de Tests TDD — Motor de Optimización SGOHA
=================================================

Metodología: Ciclo Red-Green-Refactor
- RED:    Se escribió el test antes de implementar la restricción
- GREEN:  Se implementó la restricción mínima en scheduler.py
- REFACTOR: Se optimizó con pre-filtrado de variables

Escenarios PoC documentados para validación del modelo de optimización.
"""
import pytest
from unittest.mock import MagicMock, patch, PropertyMock
from app.core.scheduler import (
    SchedulerEngine,
    SLOTS_MAÑANA,
    SLOTS_TARDE,
    NUM_DAYS,
    NUM_SLOTS,
    SLOT_TIME_MAP,
    DAY_LABELS,
)


# ═══════════════════════════════════════════════════════════════
# HELPERS: Factories para crear objetos mock
# ═══════════════════════════════════════════════════════════════

def make_curso(id=1, codigo="C001", nombre="Curso Test", creditos=3,
               tipo="Teoría", periodo=1):
    curso = MagicMock()
    curso.id = id
    curso.codigo = codigo
    curso.nombre = nombre
    curso.creditos = creditos
    curso.tipo = tipo
    curso.periodo = periodo
    return curso


def make_aula(id=1, nombre="Aula-1", capacidad=40, tipo="Teoría"):
    aula = MagicMock()
    aula.id = id
    aula.nombre = nombre
    aula.capacidad = capacidad
    aula.tipo = tipo
    return aula


def make_seccion(id=1, codigo="S001", curso=None, docente_id=1,
                 capac_estimada=30, turno="COMPLETO"):
    seccion = MagicMock()
    seccion.id = id
    seccion.codigo = codigo
    seccion.curso = curso or make_curso()
    seccion.curso_id = seccion.curso.id
    seccion.docente_id = docente_id
    seccion.capac_estimada = capac_estimada
    seccion.turno = turno
    return seccion


def make_user(id=1, username="doc_1", turno_preferido="COMPLETO"):
    user = MagicMock()
    user.id = id
    user.username = username
    user.turno_preferido = turno_preferido
    return user


def run_scheduler_with_mocks(secciones, aulas, docentes_map):
    """
    Ejecuta el scheduler con datos mockeados sin necesidad de DB real.
    Retorna el resultado del motor.
    """
    db = MagicMock()

    # Mock de queries
    db.query.return_value.all.side_effect = [secciones, aulas]
    db.query.return_value.filter.return_value.first.side_effect = (
        lambda: docentes_map.get(
            db.query.return_value.filter.call_args[0][0].right.value, 
            make_user()
        )
    )

    # Configurar el side_effect para docente lookup
    def mock_filter_first(*args, **kwargs):
        first_mock = MagicMock()
        # Extraer el docente_id del filtro
        for s in secciones:
            if s.docente_id in docentes_map:
                first_mock.first.return_value = docentes_map[s.docente_id]
                return first_mock
        first_mock.first.return_value = make_user()
        return first_mock

    engine = SchedulerEngine(db)
    return engine.generate()


# ═══════════════════════════════════════════════════════════════
# TESTS DE CONFIGURACIÓN (Smoke Tests)
# ═══════════════════════════════════════════════════════════════

class TestSchedulerConfiguration:
    """Verifica que la configuración temporal del scheduler es correcta."""

    def test_slots_manana_range(self):
        """RED: Los slots de mañana deben ser {0,1,2,3}."""
        assert SLOTS_MAÑANA == [0, 1, 2, 3]

    def test_slots_tarde_range(self):
        """RED: Los slots de tarde deben ser {4,5,6,7,8}."""
        assert SLOTS_TARDE == [4, 5, 6, 7, 8]

    def test_total_slots(self):
        """Deben existir exactamente 9 bloques horarios."""
        assert NUM_SLOTS == 9

    def test_total_days(self):
        """Deben existir exactamente 6 días (Lun-Sáb)."""
        assert NUM_DAYS == 6

    def test_slot_time_map_coverage(self):
        """Cada slot debe tener inicio, fin y 2 horas pedagógicas."""
        for slot_id in range(NUM_SLOTS):
            assert slot_id in SLOT_TIME_MAP
            info = SLOT_TIME_MAP[slot_id]
            assert "inicio" in info
            assert "fin" in info
            assert "hp" in info
            assert len(info["hp"]) == 2
            assert info["hp"][0]["hp"] == 1
            assert info["hp"][1]["hp"] == 2

    def test_day_labels_count(self):
        """Deben existir 6 etiquetas de día."""
        assert len(DAY_LABELS) == 6
        assert DAY_LABELS[0] == "Lunes"
        assert DAY_LABELS[5] == "Sábado"

    def test_morning_afternoon_no_overlap(self):
        """Los slots de mañana y tarde no deben solaparse."""
        morning_set = set(SLOTS_MAÑANA)
        afternoon_set = set(SLOTS_TARDE)
        assert morning_set.isdisjoint(afternoon_set)

    def test_all_slots_covered(self):
        """La unión de mañana + tarde debe cubrir todos los slots."""
        all_slots = set(SLOTS_MAÑANA) | set(SLOTS_TARDE)
        assert all_slots == set(range(NUM_SLOTS))


# ═══════════════════════════════════════════════════════════════
# TESTS DE VALIDACIÓN DE ENTRADA
# ═══════════════════════════════════════════════════════════════

class TestSchedulerInputValidation:
    """Verifica el manejo de entradas vacías e inválidas."""

    def test_empty_sections_returns_error(self):
        """
        RED:   test_empty → esperamos dict con 'error'
        GREEN: scheduler.py L57-58 verifica secciones vacías
        """
        db = MagicMock()
        db.query.return_value.all.side_effect = [[], [make_aula()]]

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, dict)
        assert "error" in result

    def test_empty_aulas_returns_error(self):
        """Sin aulas el motor debe retornar error."""
        db = MagicMock()
        db.query.return_value.all.side_effect = [[make_seccion()], []]

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, dict)
        assert "error" in result

    def test_empty_both_returns_error(self):
        """Sin secciones ni aulas → error."""
        db = MagicMock()
        db.query.return_value.all.side_effect = [[], []]

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, dict)
        assert "error" in result


# ═══════════════════════════════════════════════════════════════
# TESTS DE INFACTIBILIDAD (Edge Cases)
# ═══════════════════════════════════════════════════════════════

class TestSchedulerInfeasibility:
    """Verifica que el motor detecta correctamente escenarios infactibles."""

    def test_infeasible_no_compatible_room(self):
        """
        EDGE-03: Sección tipo Lab sin aula Lab → INFACTIBILIDAD.
        
        RED:   Esperamos que retorne error con "INFACTIBILIDAD"
        GREEN: Pre-filtrado en scheduler.py L94-100
        """
        curso_lab = make_curso(tipo="Laboratorio")
        seccion = make_seccion(curso=curso_lab)
        aula_teoria = make_aula(tipo="Teoría")

        db = MagicMock()
        db.query.return_value.all.side_effect = [[seccion], [aula_teoria]]
        db.query.return_value.filter.return_value.first.return_value = make_user()

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, dict)
        assert "INFACTIBILIDAD" in result.get("error", "")

    def test_infeasible_capacity_exceeded(self):
        """
        EDGE-04: Sección con capac > todas las aulas → INFACTIBILIDAD.
        """
        seccion = make_seccion(capac_estimada=200)
        aula_small = make_aula(capacidad=40)

        db = MagicMock()
        db.query.return_value.all.side_effect = [[seccion], [aula_small]]
        db.query.return_value.filter.return_value.first.return_value = make_user()

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, dict)
        assert "INFACTIBILIDAD" in result.get("error", "")


# ═══════════════════════════════════════════════════════════════
# TESTS DE ESCENARIOS PoC (Generación Exitosa)
# ═══════════════════════════════════════════════════════════════

class TestSchedulerPoCScenarios:
    """
    Escenarios controlados de Prueba de Concepto.
    Usan el motor CP-SAT real (no mockeado) para validar restricciones.
    """

    def _setup_basic_scenario(self, num_courses=2, creditos=2):
        """Helper: crea un escenario básico con N cursos de M créditos."""
        cursos = [make_curso(id=i+1, codigo=f"C{i}", creditos=creditos, periodo=i+1)
                  for i in range(num_courses)]
        aulas = [make_aula(id=j+1, nombre=f"Aula-{j}", capacidad=50)
                 for j in range(max(3, num_courses))]
        docentes = {i+1: make_user(id=i+1, username=f"doc_{i}")
                    for i in range(num_courses)}
        secciones = [make_seccion(id=i+1, codigo=f"S{i}", curso=cursos[i],
                                  docente_id=i+1)
                     for i in range(num_courses)]

        db = MagicMock()
        db.query.return_value.all.side_effect = [secciones, aulas]
        db.query.return_value.filter.return_value.first.side_effect = (
            [docentes[s.docente_id] for s in secciones]
        )

        return db, secciones, aulas, docentes

    def test_poc1_basic_generation(self):
        """
        PoC-1: Generación base exitosa.
        2 cursos × 2 créditos = 4 bloques totales esperados.
        """
        db, secciones, aulas, docentes = self._setup_basic_scenario(
            num_courses=2, creditos=2
        )

        engine = SchedulerEngine(db)
        result = engine.generate()

        assert isinstance(result, list), f"Esperaba lista, recibí: {result}"
        assert len(result) == 4  # 2 secciones × 2 bloques

    def test_poc1_no_room_collisions(self):
        """
        PoC-1: Verificar HC-4 — no hay colisiones de aula.
        """
        db, secciones, aulas, docentes = self._setup_basic_scenario(
            num_courses=3, creditos=2
        )

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            slots_usados = set()
            for r in result:
                key = (r['aula_id'], r['dia'], r['slot'])
                assert key not in slots_usados, f"Colisión de aula: {key}"
                slots_usados.add(key)

    def test_poc1_no_teacher_collisions(self):
        """
        PoC-1: Verificar HC-5 — no hay colisiones de docente.
        """
        # 3 secciones con MISMO docente → forzar test de HC-5
        curso1 = make_curso(id=1, creditos=2, periodo=1)
        curso2 = make_curso(id=2, creditos=2, periodo=2)
        curso3 = make_curso(id=3, creditos=2, periodo=3)

        secciones = [
            make_seccion(id=1, codigo="S1", curso=curso1, docente_id=1),
            make_seccion(id=2, codigo="S2", curso=curso2, docente_id=1),
            make_seccion(id=3, codigo="S3", curso=curso3, docente_id=1),
        ]
        aulas = [make_aula(id=j, capacidad=50) for j in range(1, 4)]
        docente = make_user(id=1, username="doc_unico")

        db = MagicMock()
        db.query.return_value.all.side_effect = [secciones, aulas]
        db.query.return_value.filter.return_value.first.return_value = docente

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            doc_slots = set()
            for r in result:
                key = (r['docente_nombre'], r['dia'], r['slot'])
                assert key not in doc_slots, f"Colisión de docente: {key}"
                doc_slots.add(key)

    def test_poc1_correct_block_count(self):
        """
        HC-1: Cada sección recibe exactamente N bloques = créditos.
        """
        db, secciones, aulas, docentes = self._setup_basic_scenario(
            num_courses=2, creditos=3
        )

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            from collections import Counter
            blocks_per_section = Counter(r['seccion_id'] for r in result)
            for s in secciones:
                assert blocks_per_section[s.id] == s.curso.creditos, (
                    f"Sección {s.id}: esperaba {s.curso.creditos} bloques, "
                    f"recibió {blocks_per_section[s.id]}"
                )

    def test_poc1_pedagogical_hours_structure(self):
        """
        Verificar que cada bloque incluye desglose de horas pedagógicas.
        """
        db, secciones, aulas, docentes = self._setup_basic_scenario(
            num_courses=1, creditos=2
        )

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            for r in result:
                assert 'horas_pedagogicas' in r
                assert len(r['horas_pedagogicas']) == 2
                assert r['horas_pedagogicas'][0]['hp'] == 1
                assert r['horas_pedagogicas'][1]['hp'] == 2
                # Verificar que tienen campos de tiempo
                assert 'inicio' in r['horas_pedagogicas'][0]
                assert 'fin' in r['horas_pedagogicas'][0]

    def test_poc3_morning_shift_respected(self):
        """
        PoC-3: Sección turno MAÑANA → todos los bloques en slots {0,1,2,3}.
        """
        curso = make_curso(creditos=2)
        seccion = make_seccion(curso=curso, turno="MAÑANA")
        aulas = [make_aula(id=1, capacidad=50)]
        docente = make_user(turno_preferido="COMPLETO")

        db = MagicMock()
        db.query.return_value.all.side_effect = [[seccion], aulas]
        db.query.return_value.filter.return_value.first.return_value = docente

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            for r in result:
                assert r['slot'] in SLOTS_MAÑANA, (
                    f"Bloque en slot {r['slot']} fuera de turno MAÑANA"
                )

    def test_poc3_afternoon_shift_respected(self):
        """
        PoC-3: Sección turno TARDE → todos los bloques en slots {4,5,6,7,8}.
        """
        curso = make_curso(creditos=2)
        seccion = make_seccion(curso=curso, turno="TARDE")
        aulas = [make_aula(id=1, capacidad=50)]
        docente = make_user(turno_preferido="COMPLETO")

        db = MagicMock()
        db.query.return_value.all.side_effect = [[seccion], aulas]
        db.query.return_value.filter.return_value.first.return_value = docente

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            for r in result:
                assert r['slot'] in SLOTS_TARDE, (
                    f"Bloque en slot {r['slot']} fuera de turno TARDE"
                )

    def test_poc4_no_period_collision(self):
        """
        PoC-4: Dos secciones del mismo período y turno no comparten slot.
        """
        curso1 = make_curso(id=1, codigo="C1", creditos=2, periodo=5)
        curso2 = make_curso(id=2, codigo="C2", creditos=2, periodo=5)

        secciones = [
            make_seccion(id=1, codigo="S1", curso=curso1,
                        docente_id=1, turno="MAÑANA"),
            make_seccion(id=2, codigo="S2", curso=curso2,
                        docente_id=2, turno="MAÑANA"),
        ]
        aulas = [make_aula(id=j, capacidad=50) for j in range(1, 4)]
        doc1 = make_user(id=1, username="doc1")
        doc2 = make_user(id=2, username="doc2")

        db = MagicMock()
        db.query.return_value.all.side_effect = [secciones, aulas]
        db.query.return_value.filter.return_value.first.side_effect = [doc1, doc2]

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            periodo_slots = set()
            for r in result:
                key = (r['periodo'], r['turno_seccion'], r['dia'], r['slot'])
                assert key not in periodo_slots, (
                    f"Colisión de período: {key}"
                )
                periodo_slots.add(key)

    def test_single_credit_course(self):
        """
        EDGE-08: Curso de 1 crédito → exactamente 1 bloque asignado.
        """
        curso = make_curso(creditos=1)
        seccion = make_seccion(curso=curso)
        aulas = [make_aula(id=1, capacidad=50)]
        docente = make_user()

        db = MagicMock()
        db.query.return_value.all.side_effect = [[seccion], aulas]
        db.query.return_value.filter.return_value.first.return_value = docente

        engine = SchedulerEngine(db)
        result = engine.generate()

        if isinstance(result, list):
            assert len(result) == 1, f"Esperaba 1 bloque, recibí {len(result)}"

    def test_output_contains_required_fields(self):
        """
        Verificar que la salida contiene todos los campos requeridos por specs.md.
        """
        db, secciones, aulas, docentes = self._setup_basic_scenario(
            num_courses=1, creditos=2
        )

        engine = SchedulerEngine(db)
        result = engine.generate()

        required_fields = [
            'seccion_id', 'seccion_codigo', 'aula_id', 'dia',
            'dia_nombre', 'slot', 'hora_inicio', 'hora_fin',
            'horas_pedagogicas', 'nombre_curso', 'nombre_aula',
            'tipo_curso', 'periodo', 'creditos', 'turno_seccion',
            'docente_nombre', 'codigo_curso'
        ]

        if isinstance(result, list):
            for r in result:
                for field in required_fields:
                    assert field in r, f"Campo '{field}' faltante en resultado"
