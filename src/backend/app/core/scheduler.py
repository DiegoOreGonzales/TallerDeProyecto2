from ortools.sat.python import cp_model
from sqlalchemy.orm import Session
from ..models import Seccion, Aula, User, Horario

# Slots: 0-3 = MAÑANA (07:00-11:45), 4-8 = TARDE (14:00-20:20)
SLOTS_MAÑANA = [0, 1, 2, 3]
SLOTS_TARDE = [4, 5, 6, 7, 8]
NUM_DAYS = 6   # Lun-Sáb
NUM_SLOTS = 9  # 9 bloques de 1.5h

SLOT_LABELS = [
    "07:00", "08:35", "10:10", "11:45",
    "14:00", "15:35", "17:10", "18:45", "20:20"
]

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

        # ═══════════════════════════════════════════════════════
        # VARIABLES DE DECISIÓN
        # x[s, a, d, sl] = 1 si sección s ocupa aula a el día d en slot sl
        # ═══════════════════════════════════════════════════════
        x = {}
        for s in secciones:
            for a in aulas:
                for d in range(NUM_DAYS):
                    for sl in range(NUM_SLOTS):
                        x[(s.id, a.id, d, sl)] = self.model.NewBoolVar(
                            f'x_s{s.id}_a{a.id}_d{d}_sl{sl}')

        # Variable auxiliar: qué aula usa cada sección
        uses_aula = {}
        for s in secciones:
            for a in aulas:
                uses_aula[(s.id, a.id)] = self.model.NewBoolVar(f'ua_s{s.id}_a{a.id}')

        # ═══════════════════════════════════════════════════════
        # RESTRICCIONES DURAS
        # ═══════════════════════════════════════════════════════

        for s in secciones:
            bloques_necesarios = s.curso.creditos  # 1 crédito = 1 bloque

            # (1) Cada sección necesita exactamente N bloques (= créditos)
            self.model.Add(
                sum(x[(s.id, a.id, d, sl)]
                    for a in aulas for d in range(NUM_DAYS) for sl in range(NUM_SLOTS))
                == bloques_necesarios
            )

            # (2) Cada sección usa exactamente 1 aula
            self.model.Add(sum(uses_aula[(s.id, a.id)] for a in aulas) == 1)

            # (3) Solo puede usar slots en el aula asignada
            for a in aulas:
                for d in range(NUM_DAYS):
                    for sl in range(NUM_SLOTS):
                        self.model.Add(x[(s.id, a.id, d, sl)] <= uses_aula[(s.id, a.id)])

            # (4) Máximo 3 bloques del mismo curso por día
            for d in range(NUM_DAYS):
                self.model.Add(
                    sum(x[(s.id, a.id, d, sl)] for a in aulas for sl in range(NUM_SLOTS)) <= 3
                )

            # (5) Compatibilidad de tipo aula-curso y capacidad (DOM-03, DOM-06)
            for a in aulas:
                tipo_ok = (s.curso.tipo == a.tipo) or (s.curso.tipo == "Teoría" and a.tipo == "Taller")
                cap_ok = (a.capacidad >= s.capac_estimada)
                if not (tipo_ok and cap_ok):
                    self.model.Add(uses_aula[(s.id, a.id)] == 0)

            # (6) Restricción de turno de la sección
            if s.turno == "MAÑANA":
                for a in aulas:
                    for d in range(NUM_DAYS):
                        for sl in SLOTS_TARDE:
                            self.model.Add(x[(s.id, a.id, d, sl)] == 0)
            elif s.turno == "TARDE":
                for a in aulas:
                    for d in range(NUM_DAYS):
                        for sl in SLOTS_MAÑANA:
                            self.model.Add(x[(s.id, a.id, d, sl)] == 0)

            # (7) Restricción de turno preferido del docente
            docente = self.db.query(User).filter(User.id == s.docente_id).first()
            if docente and docente.turno_preferido == "MAÑANA":
                for a in aulas:
                    for d in range(NUM_DAYS):
                        for sl in SLOTS_TARDE:
                            self.model.Add(x[(s.id, a.id, d, sl)] == 0)
            elif docente and docente.turno_preferido == "TARDE":
                for a in aulas:
                    for d in range(NUM_DAYS):
                        for sl in SLOTS_MAÑANA:
                            self.model.Add(x[(s.id, a.id, d, sl)] == 0)

        # (8) No-superposición de aulas: máximo 1 sección por aula/día/slot
        for a in aulas:
            for d in range(NUM_DAYS):
                for sl in range(NUM_SLOTS):
                    self.model.Add(
                        sum(x[(s.id, a.id, d, sl)] for s in secciones) <= 1
                    )

        # (9) No-superposición de docentes
        docente_ids = set(s.docente_id for s in secciones)
        for doc_id in docente_ids:
            doc_secciones = [s for s in secciones if s.docente_id == doc_id]
            for d in range(NUM_DAYS):
                for sl in range(NUM_SLOTS):
                    self.model.Add(
                        sum(x[(s.id, a.id, d, sl)]
                            for s in doc_secciones for a in aulas) <= 1
                    )

        # ═══════════════════════════════════════════════════════
        # FUNCIÓN OBJETIVO (Soft Constraints)
        # Priorizar slots tempranos dentro del turno permitido
        # ═══════════════════════════════════════════════════════
        objective = []
        for s in secciones:
            for a in aulas:
                for d in range(NUM_DAYS):
                    for sl in range(NUM_SLOTS):
                        # Penalización proporcional al slot (priorizar mañana)
                        cost = sl * 5
                        # Penalización extra por sábado (preferir lunes-viernes)
                        if d == 5:
                            cost += 20
                        objective.append(x[(s.id, a.id, d, sl)] * cost)

        self.model.Minimize(sum(objective))

        # ═══════════════════════════════════════════════════════
        # RESOLVER
        # ═══════════════════════════════════════════════════════
        self.solver.parameters.max_time_in_seconds = 10.0
        status = self.solver.Solve(self.model)

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            resultados = []
            for s in secciones:
                for a in aulas:
                    for d in range(NUM_DAYS):
                        for sl in range(NUM_SLOTS):
                            if self.solver.Value(x[(s.id, a.id, d, sl)]) == 1:
                                resultados.append({
                                    "seccion_id": s.id,
                                    "seccion_codigo": s.codigo,
                                    "aula_id": a.id,
                                    "dia": d,
                                    "slot": sl,
                                    "nombre_curso": s.curso.nombre,
                                    "nombre_aula": a.nombre,
                                    "tipo_curso": s.curso.tipo,
                                    "periodo": s.curso.periodo,
                                    "creditos": s.curso.creditos,
                                    "turno_seccion": s.turno,
                                })
            return resultados
        else:
            return {
                "error": (
                    "INFACTIBILIDAD: No se puede generar un horario válido. "
                    "Causas posibles: insuficientes aulas de laboratorio, "
                    "conflictos de turno docente/sección, o capacidad de aforo insuficiente."
                )
            }
