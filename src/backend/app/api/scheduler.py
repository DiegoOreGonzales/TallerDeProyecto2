from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..core.scheduler import SchedulerEngine
from ..models import Horario, Seccion, Aula, Curso, User

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])

@router.get("/")
def get_schedules(db: Session = Depends(get_db)):
    horarios = db.query(Horario).all()
    result = []
    for h in horarios:
        result.append({
            "seccion_id": h.seccion_id,
            "seccion_codigo": h.seccion.codigo,
            "aula_id": h.aula_id,
            "dia": h.dia_semana,
            "slot": h.bloque,
            "nombre_curso": h.seccion.curso.nombre,
            "nombre_aula": h.aula.nombre,
            "tipo_curso": h.seccion.curso.tipo,
            "periodo": h.seccion.curso.periodo,
            "creditos": h.seccion.curso.creditos,
            "turno_seccion": h.seccion.turno,
        })
    return {"data": result}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """KPIs dinámicos para el Dashboard."""
    return {
        "cursos": db.query(Curso).count(),
        "aulas": db.query(Aula).count(),
        "secciones": db.query(Seccion).count(),
        "docentes": db.query(User).filter(User.role == "docente").count(),
        "horarios_generados": db.query(Horario).count(),
    }

@router.post("/generate")
def generate_schedule(db: Session = Depends(get_db)):
    # Limpiar horarios previos
    db.query(Horario).delete()
    db.commit()

    engine = SchedulerEngine(db)
    result = engine.generate()
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Persistir cada bloque asignado
    for h in result:
        new_horario = Horario(
            seccion_id=h["seccion_id"],
            aula_id=h["aula_id"],
            dia_semana=h["dia"],
            bloque=h["slot"],
        )
        db.add(new_horario)
    
    db.commit()
    return {"message": f"Horario generado: {len(result)} bloques asignados", "data": result}
