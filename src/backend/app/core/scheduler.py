from ortools.sat.python import cp_model
from sqlalchemy.orm import Session
from ..models import Seccion, Aula, User, Horario

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN DE GRILLA TEMPORAL
# ═══════════════════════════════════════════════════════════════

SLOTS_MAÑANA = [0, 1, 2, 3]
SLOTS_TARDE = [4, 5, 6, 7, 8]
NUM_DAYS = 6   # Lun-Sáb
NUM_SLOTS = 9  # 9 bloques de ~90 min

SLOT_TIME_MAP = {
    0: {"inicio": "07:00", "fin": "08:30", "hp": [
        {"hp": 1, "inicio": "07:00", "fin": "07:40"},
        {"hp": 2, "inicio": "07:50", "fin": "08:30"}]},
    1: {"inicio": "08:35", "fin": "10:05", "hp": [
        {"hp": 1, "inicio": "08:35", "fin": "09:15"},
        {"hp": 2, "inicio": "09:25", "fin": "10:05"}]},
    2: {"inicio": "10:10", "fin": "11:40", "hp": [
        {"hp": 1, "inicio": "10:10", "fin": "10:50"},
        {"hp": 2, "inicio": "11:00", "fin": "11:40"}]},
    3: {"inicio": "11:45", "fin": "13:15", "hp": [
        {"hp": 1, "inicio": "11:45", "fin": "12:25"},
        {"hp": 2, "inicio": "12:35", "fin": "13:15"}]},
    4: {"inicio": "14:00", "fin": "15:30", "hp": [
        {"hp": 1, "inicio": "14:00", "fin": "14:40"},
        {"hp": 2, "inicio": "14:50", "fin": "15:30"}]},
    5: {"inicio": "15:35", "fin": "17:05", "hp": [
        {"hp": 1, "inicio": "15:35", "fin": "16:15"},
        {"hp": 2, "inicio": "16:25", "fin": "17:05"}]},
    6: {"inicio": "17:10", "fin": "18:40", "hp": [
        {"hp": 1, "inicio": "17:10", "fin": "17:50"},
        {"hp": 2, "inicio": "18:00", "fin": "18:40"}]},
    7: {"inicio": "18:45", "fin": "20:15", "hp": [
        {"hp": 1, "inicio": "18:45", "fin": "19:25"},
        {"hp": 2, "inicio": "19:35", "fin": "20:15"}]},
    8: {"inicio": "20:20", "fin": "21:50", "hp": [
        {"hp": 1, "inicio": "20:20", "fin": "21:00"},
        {"hp": 2, "inicio": "21:10", "fin": "21:50"}]},
}

DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]


class SchedulerEngine:
    def __init__(self, db: Session):
        self.db = db
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()

    def generate(self):
        secciones = self.db.query(Seccion).all()
        aulas = self.db.query(Aula).all()

        if not secciones or not aulas:
            return {"error": "No hay secciones o aulas registradas para generar horarios."}

        # Pre-computar docentes
        docentes_cache = {}
        for s in secciones:
            if s.docente_id not in docentes_cache:
                docentes_cache[s.docente_id] = self.db.query(User).filter(
                    User.id == s.docente_id).first()

        # ═══════════════════════════════════════════════════════
        # PRE-FILTRAR: slots y aulas válidos por sección
        # ═══════════════════════════════════════════════════════
        valid_aulas = {}
        valid_slots = {}

        for s in secciones:
            va = []
            for a in aulas:
                tipo_ok = (s.curso.tipo == a.tipo) or \
                          (s.curso.tipo == "Teoría" and a.tipo == "Taller")
                cap_ok = (a.capacidad >= s.capac_estimada)
                if tipo_ok and cap_ok:
                    va.append(a.id)
            valid_aulas[s.id] = va

            docente = docentes_cache.get(s.docente_id)
            turno_sec = s.turno
            turno_doc = docente.turno_preferido if docente else "COMPLETO"

            if turno_sec == "MAÑANA" or turno_doc == "MAÑANA":
                valid_slots[s.id] = list(SLOTS_MAÑANA)
            elif turno_sec == "TARDE" or turno_doc == "TARDE":
                valid_slots[s.id] = list(SLOTS_TARDE)
            else:
                valid_slots[s.id] = list(range(NUM_SLOTS))

        # Verificar factibilidad previa
        for s in secciones:
            if not valid_aulas[s.id]:
                return {
                    "error": f"INFACTIBILIDAD: Sección '{s.codigo}' (tipo: {s.curso.tipo}, "
                             f"aforo: {s.capac_estimada}) no tiene aula compatible."
                }

        # ═══════════════════════════════════════════════════════
        # VARIABLES DE DECISIÓN
        # ═══════════════════════════════════════════════════════
        x = {}
        for s in secciones:
            for a_id in valid_aulas[s.id]:
                for d in range(NUM_DAYS):
                    for sl in valid_slots[s.id]:
                        x[(s.id, a_id, d, sl)] = self.model.NewBoolVar(
                            f'x_{s.id}_{a_id}_{d}_{sl}')

        uses_aula = {}
        for s in secciones:
            for a_id in valid_aulas[s.id]:
                uses_aula[(s.id, a_id)] = self.model.NewBoolVar(
                    f'ua_{s.id}_{a_id}')

        # Helper: bloques por sección por día (para soft constraints)
        bloques_dia_var = {}
        for s in secciones:
            for d in range(NUM_DAYS):
                bloques_dia_var[(s.id, d)] = self.model.NewIntVar(
                    0, min(s.curso.creditos, 3), f'bd_{s.id}_{d}')

        # ═══════════════════════════════════════════════════════
        # RESTRICCIONES DURAS (solo las esenciales)
        # ═══════════════════════════════════════════════════════
        for s in secciones:
            bloques = s.curso.creditos
            va = valid_aulas[s.id]
            vs = valid_slots[s.id]

            # (1) Asignación completa: exactamente N bloques
            self.model.Add(
                sum(x[(s.id, a_id, d, sl)]
                    for a_id in va for d in range(NUM_DAYS) for sl in vs)
                == bloques
            )

            # (2) Exactamente 1 aula
            self.model.Add(sum(uses_aula[(s.id, a_id)] for a_id in va) == 1)

            # (3) Solo usar slots en el aula asignada
            for a_id in va:
                for d in range(NUM_DAYS):
                    for sl in vs:
                        self.model.Add(
                            x[(s.id, a_id, d, sl)] <= uses_aula[(s.id, a_id)])

            # (4) Máximo 3 bloques por día
            for d in range(NUM_DAYS):
                day_sum = sum(x[(s.id, a_id, d, sl)]
                              for a_id in va for sl in vs)
                self.model.Add(day_sum <= 3)
                # Vincular con variable auxiliar
                self.model.Add(bloques_dia_var[(s.id, d)] == day_sum)

        # (5) No-superposición de aulas
        aula_ids_all = set()
        for s in secciones:
            aula_ids_all.update(valid_aulas[s.id])

        for a_id in aula_ids_all:
            for d in range(NUM_DAYS):
                for sl in range(NUM_SLOTS):
                    vars_list = []
                    for s in secciones:
                        if a_id in valid_aulas[s.id] and sl in valid_slots[s.id]:
                            vars_list.append(x[(s.id, a_id, d, sl)])
                    if len(vars_list) > 1:
                        self.model.Add(sum(vars_list) <= 1)

        # (6) No-superposición de docentes
        docente_ids = set(s.docente_id for s in secciones)
        for doc_id in docente_ids:
            doc_secs = [s for s in secciones if s.docente_id == doc_id]
            if len(doc_secs) <= 1:
                continue
            for d in range(NUM_DAYS):
                for sl in range(NUM_SLOTS):
                    vars_list = []
                    for s in doc_secs:
                        if sl in valid_slots[s.id]:
                            for a_id in valid_aulas[s.id]:
                                vars_list.append(x[(s.id, a_id, d, sl)])
                    if len(vars_list) > 1:
                        self.model.Add(sum(vars_list) <= 1)

        # (7) Carga máxima docente: ≤ 30 bloques semanales
        for doc_id in docente_ids:
            doc_secs = [s for s in secciones if s.docente_id == doc_id]
            all_vars = []
            for s in doc_secs:
                for a_id in valid_aulas[s.id]:
                    for d in range(NUM_DAYS):
                        for sl in valid_slots[s.id]:
                            all_vars.append(x[(s.id, a_id, d, sl)])
            if all_vars:
                self.model.Add(sum(all_vars) <= 30)

        # (8) No-colisión por periodo académico y turno
        # Dos secciones del MISMO periodo y MISMO turno no pueden compartir slot/día.
        # Esto garantiza que un estudiante nunca ve dos cursos de su ciclo al mismo tiempo.
        periodos_set = set(s.curso.periodo for s in secciones)
        turnos_set = ['MAÑANA', 'TARDE']  # Solo verificar turnos fijos (no COMPLETO)

        for periodo in periodos_set:
            for turno in turnos_set:
                # Secciones de este periodo y turno
                secs_pt = [s for s in secciones
                           if s.curso.periodo == periodo and s.turno == turno]
                if len(secs_pt) <= 1:
                    continue
                # Para cada dia/slot, máximo 1 sección de este periodo+turno activa
                for d in range(NUM_DAYS):
                    for sl in range(NUM_SLOTS):
                        if sl not in (SLOTS_MAÑANA if turno == 'MAÑANA' else SLOTS_TARDE):
                            continue
                        vars_pt = []
                        for s in secs_pt:
                            if sl in valid_slots[s.id]:
                                for a_id in valid_aulas[s.id]:
                                    vars_pt.append(x[(s.id, a_id, d, sl)])
                        if len(vars_pt) > 1:
                            self.model.Add(sum(vars_pt) <= 1)


        # ═══════════════════════════════════════════════════════
        # FUNCIÓN OBJETIVO (todo lo "suave" va aquí)
        # ═══════════════════════════════════════════════════════
        obj = []

        for s in secciones:
            va = valid_aulas[s.id]
            vs = valid_slots[s.id]
            turno = s.turno

            # --- Soft 1: Preferencia de slot según turno ---
            for a_id in va:
                for d in range(NUM_DAYS):
                    for sl in vs:
                        cost = 0
                        if turno == "MAÑANA":
                            cost = sl * 3
                        elif turno == "TARDE":
                            cost = max(0, sl - 6) * 10
                        else:
                            cost = max(0, sl - 7) * 8
                        # Sábado
                        if d == 5:
                            cost += 25
                        obj.append(x[(s.id, a_id, d, sl)] * cost)

            # --- Soft 2: Penalizar dispersión (muchos días con pocos bloques) ---
            # Preferir sesiones de 2 bloques → penalizar días con exactamente 1 bloque
            for d in range(NUM_DAYS):
                # is_single[s,d] = 1 si la sección tiene exactamente 1 bloque ese día
                is_single = self.model.NewBoolVar(f'single_{s.id}_{d}')
                self.model.Add(bloques_dia_var[(s.id, d)] == 1).OnlyEnforceIf(is_single)
                self.model.Add(bloques_dia_var[(s.id, d)] != 1).OnlyEnforceIf(is_single.Not())
                # Penalizar bloques sueltos con 15 puntos
                obj.append(is_single * 15)

            # --- Soft 3: Penalizar huecos (slots no contiguos en el mismo día) ---
            for d in range(NUM_DAYS):
                vs_sorted = sorted(vs)
                for i in range(len(vs_sorted) - 2):
                    sl_a = vs_sorted[i]
                    sl_c = vs_sorted[i + 2]
                    sl_b = vs_sorted[i + 1]
                    # Si slot_a y slot_c activos pero slot_b no → hueco
                    has_a = sum(x[(s.id, a_id, d, sl_a)] for a_id in va)
                    has_c = sum(x[(s.id, a_id, d, sl_c)] for a_id in va)
                    has_b = sum(x[(s.id, a_id, d, sl_b)] for a_id in va)
                    gap = self.model.NewBoolVar(f'gap_{s.id}_{d}_{i}')
                    # gap = 1 if has_a + has_c >= 2 and has_b == 0
                    # Approximate: gap >= has_a + has_c - has_b - 1
                    self.model.Add(has_a + has_c - has_b - 1 <= gap)
                    self.model.Add(gap <= has_a)
                    self.model.Add(gap <= has_c)
                    obj.append(gap * 50)  # Fuerte penalización por huecos

        self.model.Minimize(sum(obj))

        # ═══════════════════════════════════════════════════════
        # RESOLVER
        # ═══════════════════════════════════════════════════════
        self.solver.parameters.max_time_in_seconds = 120.0
        self.solver.parameters.num_workers = 8
        self.solver.parameters.log_search_progress = True
        status = self.solver.Solve(self.model)

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            resultados = []
            for s in secciones:
                docente = docentes_cache.get(s.docente_id)
                docente_nombre = docente.username if docente else "Sin asignar"
                for a_id in valid_aulas[s.id]:
                    for d in range(NUM_DAYS):
                        for sl in valid_slots[s.id]:
                            if self.solver.Value(x[(s.id, a_id, d, sl)]) == 1:
                                aula_obj = next(
                                    (a for a in aulas if a.id == a_id), None)
                                slot_info = SLOT_TIME_MAP[sl]
                                resultados.append({
                                    "seccion_id": s.id,
                                    "seccion_codigo": s.codigo,
                                    "aula_id": a_id,
                                    "dia": d,
                                    "dia_nombre": DAY_LABELS[d],
                                    "slot": sl,
                                    "hora_inicio": slot_info["inicio"],
                                    "hora_fin": slot_info["fin"],
                                    "horas_pedagogicas": slot_info["hp"],
                                    "nombre_curso": s.curso.nombre,
                                    "nombre_aula": aula_obj.nombre if aula_obj else f"Aula {a_id}",
                                    "tipo_curso": s.curso.tipo,
                                    "periodo": s.curso.periodo,
                                    "creditos": s.curso.creditos,
                                    "turno_seccion": s.turno,
                                    "docente_nombre": docente_nombre,
                                    "codigo_curso": s.curso.codigo,
                                })
            return resultados
        else:
            return {
                "error": (
                    f"INFACTIBILIDAD: No se puede generar horario. "
                    f"Estado: {self.solver.StatusName(status)}. "
                    f"Secciones: {len(secciones)}, Aulas: {len(aulas)}. "
                    f"Revise aulas de laboratorio, turnos docente/sección y aforo."
                )
            }
