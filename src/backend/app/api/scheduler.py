from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..core.scheduler import SchedulerEngine
from ..models import Horario

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])

@router.post("/generate")
def generate_schedule(db: Session = Depends(get_db)):
    engine = SchedulerEngine(db)
    result = engine.generate()
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Limpiar horarios previos (PMV)
    db.query(Horario).delete()
    
    # Guardar nuevos horarios
    for h in result:
        new_horario = Horario(
            curso_id=h["curso_id"],
            aula_id=h["aula_id"],
            dia_semana=h["dia"],
            hora_inicio=800 + (h["slot"] * 100),  # Slot a hora
            hora_fin=900 + (h["slot"] * 100)
        )
        db.add(new_horario)
    
    db.commit()
    return {"message": "Horario generado con éxito", "data": result}
