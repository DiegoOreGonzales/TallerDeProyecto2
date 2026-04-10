from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models import Curso

router = APIRouter(prefix="/cursos", tags=["Cursos"])

class CursoBase(BaseModel):
    codigo: str
    nombre: str
    creditos: int = 4

class CursoCreate(CursoBase):
    pass

class CursoUpdate(BaseModel):
    nombre: Optional[str] = None
    creditos: Optional[int] = None

class CursoOut(CursoBase):
    id: int
    class Config:
        from_attributes = True

@router.post("/", response_model=CursoOut)
def create_curso(curso: CursoCreate, db: Session = Depends(get_db)):
    db_curso = db.query(Curso).filter(Curso.codigo == curso.codigo).first()
    if db_curso:
        raise HTTPException(status_code=400, detail="El código de curso ya existe")
    new_curso = Curso(**curso.model_dump())
    db.add(new_curso)
    db.commit()
    db.refresh(new_curso)
    return new_curso

@router.get("/", response_model=List[CursoOut])
def get_cursos(db: Session = Depends(get_db)):
    return db.query(Curso).all()

@router.get("/{curso_id}", response_model=CursoOut)
def get_curso(curso_id: int, db: Session = Depends(get_db)):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return curso

@router.delete("/{curso_id}")
def delete_curso(curso_id: int, db: Session = Depends(get_db)):
    curso = db.query(Curso).filter(Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    db.delete(curso)
    db.commit()
    return {"message": "Curso eliminado"}
