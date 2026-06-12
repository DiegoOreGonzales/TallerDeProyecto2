from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/secciones", tags=["Secciones"])


class SeccionOut(BaseModel):
    id: int
    codigo: str
    curso_id: int
    docente_id: int
    capac_estimada: int
    turno: str

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[schemas.Seccion])
def get_secciones(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.Seccion).offset(skip).limit(limit).all()


@router.post("/", response_model=SeccionOut)
def create_seccion(seccion: schemas.SeccionCreate, db: Session = Depends(get_db)):
    db_seccion = models.Seccion(**seccion.model_dump())
    db.add(db_seccion)
    db.commit()
    db.refresh(db_seccion)
    return db_seccion


@router.delete("/{seccion_id}")
def delete_seccion(seccion_id: int, db: Session = Depends(get_db)):
    seccion = db.query(models.Seccion).filter(models.Seccion.id == seccion_id).first()
    if not seccion:
        raise HTTPException(status_code=404, detail="Sección no encontrada")
    db.delete(seccion)
    db.commit()
    return {"message": "Sección eliminada"}
