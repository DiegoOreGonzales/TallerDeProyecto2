from ortools.sat.python import cp_model
from typing import List, Dict
from sqlalchemy.orm import Session
from ..models import Curso, Aula, User, Horario

class SchedulerEngine:
    def __init__(self, db: Session):
        self.db = db
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()

    def generate(self):
        # 1. Obtener datos
        cursos = self.db.query(Curso).all()
        aulas = self.db.query(Aula).all()
        docentes = self.db.query(User).filter(User.role == "docente").all()
        
        if not cursos or not aulas:
            return {"error": "Faltan datos (cursos o aulas) para generar horarios"}

        # Parámetros: 5 días (0-4), 8 bloques por día (0-7, ej: 8:00 a 16:00)
        num_days = 5
        num_slots = 8
        
        # Variables de decisión: x[c, a, d, s] = 1 si curso c está en aula a el día d en slot s
        # Para simplificar el PMV: asignamos cada curso a UN solo bloque (slot) semanal
        # En una versión real, un curso puede tener múltiples bloques.
        
        vars = {}
        for c in cursos:
            for a in aulas:
                for d in range(num_days):
                    for s in range(num_slots):
                        vars[(c.id, a.id, d, s)] = self.model.NewBoolVar(f'c{c.id}_a{a.id}_d{d}_s{s}')

        # Restricción 1: Cada curso debe tener exactamente UN bloque asignado (Simplificación PMV)
        for c in cursos:
            self.model.Add(sum(vars[(c.id, a.id, d, s)] for a in aulas for d in range(num_days) for s in range(num_slots)) == 1)

        # Restricción 2: Un aula no puede tener más de un curso en el mismo (día, slot)
        for a in aulas:
            for d in range(num_days):
                for s in range(num_slots):
                    self.model.Add(sum(vars[(c.id, a.id, d, s)] for c in cursos) <= 1)

        # 3. Resolver
        status = self.solver.Solve(self.model)

        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            resultados = []
            for c in cursos:
                for a in aulas:
                    for d in range(num_days):
                        for s in range(num_slots):
                            if self.solver.Value(vars[(c.id, a.id, d, s)]) == 1:
                                resultados.append({
                                    "curso_id": c.id,
                                    "aula_id": a.id,
                                    "dia": d,
                                    "slot": s,
                                    "nombre_curso": c.nombre,
                                    "nombre_aula": a.nombre
                                })
            return resultados
        else:
            return {"error": "No se encontró una solución válida con las restricciones actuales"}
