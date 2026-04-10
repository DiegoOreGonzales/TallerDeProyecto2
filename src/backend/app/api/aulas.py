from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models import Aula

router = APIRouter(prefix="/aulas", tags=["Aulas"])

class AulaBase(BaseModel):
    nombre: str
    capacidad: int
    tipo: str = "Teoría"

class AulaCreate(AulaBase):
    pass

class AulaOut(AulaBase):
    id: int
    class Config:
        from_attributes = True

@router.post("/", response_model=AulaOut)
def create_aula(aula: AulaCreate, db: Session = Depends(get_db)):
    db_aula = db.query(Aula).filter(Aula.nombre == aula.nombre).first()
    if db_aula:
        raise HTTPException(status_code=400, detail="El aula ya existe")
    new_aula = Aula(**aula.model_dump())
    db.add(new_aula)
    db.commit()
    db.refresh(new_aula)
    return new_aula

@router.get("/", response_model=List[AulaOut])
def get_aulas(db: Session = Depends(get_db)):
    return db.query(Aula).all()

@router.delete("/{aula_id}")
def delete_aula(aula_id: int, db: Session = Depends(get_db)):
    aula = db.query(Aula).filter(Aula.id == aula_id).first()
    if not aula:
        raise HTTPException(status_code=404, detail="Aula no encontrada")
    db.delete(aula)
    db.commit()
    return {"message": "Aula eliminada"}
