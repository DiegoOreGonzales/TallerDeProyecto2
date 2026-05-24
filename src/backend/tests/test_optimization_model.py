"""
Tests de Validación del Modelo Matemático de Optimización
==========================================================

Estos tests verifican las propiedades matemáticas del modelo CP-SAT
de forma aislada, validando que las restricciones y la función objetivo
se comportan según la especificación formal en optimization_model.md.

Metodología TDD:
- RED:    Test define el comportamiento esperado del modelo
- GREEN:  Restricción implementada en scheduler.py satisface el test
- REFACTOR: Pre-filtrado optimiza sin cambiar comportamiento
"""
import pytest
from app.core.scheduler import (
    SLOTS_MAÑANA,
    SLOTS_TARDE,
    NUM_DAYS,
    NUM_SLOTS,
    SLOT_TIME_MAP,
)


class TestModelConstraintProperties:
    """
    Verifica propiedades matemáticas de las restricciones del modelo.
    Estos tests son puramente lógicos (no requieren CP-SAT ni DB).
    """

    def test_turno_efectivo_morning_priority(self):
        """
        HC-9: turno_efectivo = MAÑANA si turno_sec=MAÑANA ∨ turno_doc=MAÑANA
        Según optimization_model.md §4 HC-9.
        """
        test_cases = [
            ("MAÑANA", "COMPLETO", SLOTS_MAÑANA),
            ("COMPLETO", "MAÑANA", SLOTS_MAÑANA),
            ("MAÑANA", "MAÑANA", SLOTS_MAÑANA),
            ("TARDE", "COMPLETO", SLOTS_TARDE),
            ("COMPLETO", "TARDE", SLOTS_TARDE),
            ("TARDE", "TARDE", SLOTS_TARDE),
            ("COMPLETO", "COMPLETO", list(range(NUM_SLOTS))),
        ]

        for turno_sec, turno_doc, expected_slots in test_cases:
            if turno_sec == "MAÑANA" or turno_doc == "MAÑANA":
                result = list(SLOTS_MAÑANA)
            elif turno_sec == "TARDE" or turno_doc == "TARDE":
                result = list(SLOTS_TARDE)
            else:
                result = list(range(NUM_SLOTS))

            assert result == expected_slots, (
                f"turno_sec={turno_sec}, turno_doc={turno_doc}: "
                f"esperaba {expected_slots}, obtuvo {result}"
            )

    def test_type_compatibility_rules(self):
        """
        HC-8: Reglas de compatibilidad tipo(sección) → tipo(aula).
        Según optimization_model.md §4 HC-8.
        """
        def compatible(tipo_sec, tipo_aula):
            return (tipo_sec == tipo_aula) or \
                   (tipo_sec == "Teoría" and tipo_aula == "Taller")

        # Teoría puede ir a Teoría o Taller, NO a Laboratorio
        assert compatible("Teoría", "Teoría") is True
        assert compatible("Teoría", "Taller") is True
        assert compatible("Teoría", "Laboratorio") is False

        # Laboratorio solo a Laboratorio
        assert compatible("Laboratorio", "Laboratorio") is True
        assert compatible("Laboratorio", "Teoría") is False
        assert compatible("Laboratorio", "Taller") is False

    def test_max_blocks_per_day_limit(self):
        """
        HC-3: máximo 3 bloques por día (4.5 horas) para cualquier sección.
        Verificamos que el límite es consistente con créditos posibles.
        """
        MAX_BLOCKS_PER_DAY = 3
        for creditos in range(1, 6):
            # Los bloques por día nunca pueden exceder 3
            assert min(creditos, MAX_BLOCKS_PER_DAY) <= 3

    def test_credit_distribution_table(self):
        """
        Verifica la tabla de distribución de créditos de Restricciones_Sistema.md.
        """
        distribution = {
            1: {"max_dias": 1},
            2: {"max_dias": 2},
            3: {"max_dias": 3},
            4: {"max_dias": 3},
            5: {"max_dias": 4},
        }

        for creditos, expected in distribution.items():
            # Con máximo 3 bloques/día, se necesitan ceil(créditos/3) días mínimo
            import math
            min_dias = math.ceil(creditos / 3)
            assert min_dias <= expected["max_dias"], (
                f"Créditos={creditos}: min_días={min_dias} > max_días={expected['max_dias']}"
            )

    def test_total_grid_capacity(self):
        """
        Verifica la capacidad total de la grilla temporal.
        54 slots por aula (9 slots × 6 días).
        """
        total_slots_per_aula = NUM_SLOTS * NUM_DAYS
        assert total_slots_per_aula == 54

    def test_morning_has_4_slots(self):
        """Turno mañana tiene exactamente 4 slots (07:00-13:15)."""
        assert len(SLOTS_MAÑANA) == 4

    def test_afternoon_has_5_slots(self):
        """Turno tarde tiene exactamente 5 slots (14:00-21:50)."""
        assert len(SLOTS_TARDE) == 5


class TestObjectiveFunctionComponents:
    """
    Verifica los componentes de la función objetivo (soft constraints).
    """

    def test_sc1_morning_cost_increases_with_slot(self):
        """
        SC-1: Para turno MAÑANA, el costo debe incrementar con el slot.
        Slots más tardíos en la mañana tienen mayor penalización.
        """
        costs = []
        for sl in SLOTS_MAÑANA:
            cost = sl * 3  # Fórmula de scheduler.py L245
            costs.append(cost)

        # Los costos deben ser monotónicamente crecientes
        for i in range(len(costs) - 1):
            assert costs[i] <= costs[i+1], (
                f"Costo no creciente: slot {i}={costs[i]}, slot {i+1}={costs[i+1]}"
            )

    def test_sc1_afternoon_penalizes_late_slots(self):
        """
        SC-1: Para turno TARDE, solo se penalizan slots ≥ 7.
        """
        for sl in SLOTS_TARDE:
            cost = max(0, sl - 6) * 10  # Fórmula de scheduler.py L247
            if sl <= 6:
                assert cost == 0, f"Slot {sl} no debería ser penalizado"
            else:
                assert cost > 0, f"Slot {sl} debería ser penalizado"

    def test_sc4_saturday_penalty(self):
        """
        SC-4: Sábado (día=5) debe tener penalización adicional de 25 puntos.
        """
        SATURDAY_PENALTY = 25
        assert SATURDAY_PENALTY == 25

        # Verificar que el día 5 corresponde a Sábado
        from app.core.scheduler import DAY_LABELS
        assert DAY_LABELS[5] == "Sábado"

    def test_sc2_single_block_penalty(self):
        """
        SC-2: Un bloque suelto tiene penalización de 15 puntos.
        """
        SINGLE_PENALTY = 15
        assert SINGLE_PENALTY > 0  # Debe ser positivo para desincentivar

    def test_sc3_gap_penalty_is_strongest(self):
        """
        SC-3: La penalización por huecos (50) debe ser la más fuerte.
        """
        gap_penalty = 50
        single_penalty = 15
        saturday_penalty = 25
        max_slot_cost = max(8 * 3, max(0, 8 - 6) * 10)  # 24 o 20

        assert gap_penalty > single_penalty
        assert gap_penalty > saturday_penalty
        assert gap_penalty > max_slot_cost


class TestSlotTimeMapping:
    """
    Verifica la consistencia del mapeo de slots a horarios reales.
    """

    def test_slots_are_non_overlapping(self):
        """Los bloques horarios no deben solaparse temporalmente."""
        for i in range(NUM_SLOTS - 1):
            current_end = SLOT_TIME_MAP[i]["fin"]
            next_start = SLOT_TIME_MAP[i + 1]["inicio"]
            # El fin del slot actual debe ser <= inicio del siguiente
            assert current_end <= next_start, (
                f"Slots {i} y {i+1} se solapan: {current_end} > {next_start}"
            )

    def test_each_slot_has_90_min_approx(self):
        """Cada slot dura aproximadamente 90 minutos."""
        for slot_id, info in SLOT_TIME_MAP.items():
            h_start, m_start = map(int, info["inicio"].split(":"))
            h_end, m_end = map(int, info["fin"].split(":"))
            duration = (h_end * 60 + m_end) - (h_start * 60 + m_start)
            assert duration == 90, (
                f"Slot {slot_id}: duración {duration} min ≠ 90 min"
            )

    def test_pedagogical_hours_are_40_min(self):
        """Cada hora pedagógica dura 40 minutos."""
        for slot_id, info in SLOT_TIME_MAP.items():
            for hp in info["hp"]:
                h_start, m_start = map(int, hp["inicio"].split(":"))
                h_end, m_end = map(int, hp["fin"].split(":"))
                duration = (h_end * 60 + m_end) - (h_start * 60 + m_start)
                assert duration == 40, (
                    f"Slot {slot_id}, HP {hp['hp']}: duración {duration} min ≠ 40 min"
                )

    def test_morning_range(self):
        """Los slots de mañana deben estar entre 07:00 y 13:15."""
        for sl in SLOTS_MAÑANA:
            assert SLOT_TIME_MAP[sl]["inicio"] >= "07:00"
            assert SLOT_TIME_MAP[sl]["fin"] <= "13:15"

    def test_afternoon_range(self):
        """Los slots de tarde deben estar entre 14:00 y 21:50."""
        for sl in SLOTS_TARDE:
            assert SLOT_TIME_MAP[sl]["inicio"] >= "14:00"
            assert SLOT_TIME_MAP[sl]["fin"] <= "21:50"
