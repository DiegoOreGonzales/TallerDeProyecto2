from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Curso as CursoModel
from ..schemas import Curso as CursoSchema, CursoCreate

router = APIRouter(prefix="/cursos", tags=["Cursos"])

@router.post("/", response_model=CursoSchema)
def create_curso(curso: CursoCreate, db: Session = Depends(get_db)):
    existing = db.query(CursoModel).filter(CursoModel.codigo == curso.codigo).first()
    if existing:
        raise HTTPException(status_code=400, detail="El código de curso ya existe")
    new_curso = CursoModel(**curso.model_dump())
    db.add(new_curso)
    db.commit()
    db.refresh(new_curso)
    return new_curso

@router.get("/", response_model=List[CursoSchema])
def get_cursos(db: Session = Depends(get_db)):
    return db.query(CursoModel).order_by(CursoModel.periodo, CursoModel.codigo).all()

@router.get("/{curso_id}", response_model=CursoSchema)
def get_curso(curso_id: int, db: Session = Depends(get_db)):
    curso = db.query(CursoModel).filter(CursoModel.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return curso

@router.delete("/{curso_id}")
def delete_curso(curso_id: int, db: Session = Depends(get_db)):
    curso = db.query(CursoModel).filter(CursoModel.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    db.delete(curso)
    db.commit()
    return {"message": "Curso eliminado"}
