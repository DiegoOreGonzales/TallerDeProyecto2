import pytest
from app.core.scheduler import SchedulerEngine
from app.database import SessionLocal

def test_scheduler_no_collisions():
    """
    Verifica que el motor no genere colisiones de docentes o aulas.
    """
    db = SessionLocal()
    engine = SchedulerEngine(db)
    result = engine.generate()
    
    if isinstance(result, list):
        # Verificar colisiones de aula (aula, dia, slot)
        slots_ocupados = set()
        for res in result:
            key = (res['aula_id'], res['dia'], res['slot'])
            assert key not in slots_ocupados, f"Colisión de aula detectada: {key}"
            slots_ocupados.add(key)
            
        # Verificar colisiones de docente (docente, dia, slot)
        docentes_ocupados = set()
        for res in result:
            key = (res['docente_nombre'], res['dia'], res['slot'])
            assert key not in docentes_ocupados, f"Colisión de docente detectada: {key}"
            docentes_ocupados.add(key)
    
    db.close()

def test_scheduler_pedagogical_hours():
    """
    Verifica que todos los bloques tengan información de horas pedagógicas.
    """
    db = SessionLocal()
    engine = SchedulerEngine(db)
    result = engine.generate()
    
    if isinstance(result, list):
        for res in result:
            assert 'horas_pedagogicas' in res
            assert len(res['horas_pedagogicas']) == 2
            assert res['horas_pedagogicas'][0]['hp'] == 1
            assert res['horas_pedagogicas'][1]['hp'] == 2
            
    db.close()

def test_scheduler_period_collision_fix():
    """
    Verifica que no haya dos cursos del mismo periodo en el mismo slot.
    """
    db = SessionLocal()
    engine = SchedulerEngine(db)
    result = engine.generate()
    
    if isinstance(result, list):
        # Agrupar por ciclo/periodo y turno
        periodo_turno_slots = set()
        for res in result:
            # Solo para turnos fijos (MAÑANA/TARDE) para evitar falsos positivos de secciones paralelas
            if res['turno_seccion'] in ['MAÑANA', 'TARDE']:
                key = (res['periodo'], res['turno_seccion'], res['dia'], res['slot'])
                assert key not in periodo_turno_slots, f"Colisión de periodo detectada: {key}"
                periodo_turno_slots.add(key)
                
    db.close()
