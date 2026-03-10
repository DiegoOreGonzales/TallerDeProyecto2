from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Aula as AulaModel
from ..schemas import Aula as AulaSchema, AulaCreate

router = APIRouter(prefix="/aulas", tags=["Aulas"])

@router.post("/", response_model=AulaSchema)
def create_aula(aula: AulaCreate, db: Session = Depends(get_db)):
    existing = db.query(AulaModel).filter(AulaModel.nombre == aula.nombre).first()
    if existing:
        raise HTTPException(status_code=400, detail="El aula ya existe")
    new_aula = AulaModel(**aula.model_dump())
    db.add(new_aula)
    db.commit()
    db.refresh(new_aula)
    return new_aula

@router.get("/", response_model=List[AulaSchema])
def get_aulas(db: Session = Depends(get_db)):
    return db.query(AulaModel).all()

@router.delete("/{aula_id}")
def delete_aula(aula_id: int, db: Session = Depends(get_db)):
    aula = db.query(AulaModel).filter(AulaModel.id == aula_id).first()
    if not aula:
        raise HTTPException(status_code=404, detail="Aula no encontrada")
    db.delete(aula)
    db.commit()
    return {"message": "Aula eliminada"}
