from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/secciones", tags=["Secciones"])

@router.get("/", response_model=List[schemas.Seccion])
def get_secciones(db: Session = Depends(get_db)):
    return db.query(models.Seccion).all()

@router.post("/", response_model=schemas.Seccion)
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
