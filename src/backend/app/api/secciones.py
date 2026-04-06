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
    db_seccion = models.Seccion(**seccion.dict())
    db.add(db_seccion)
    db.commit()
    db.refresh(db_seccion)
    return db_seccion
