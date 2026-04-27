from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from ..database import get_db
from ..models import User
from ..auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_role: str
    user_name: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    turno_preferido: str
    is_active: bool
    class Config:
        from_attributes = True

class UserCreateReq(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "docente"
    turno_preferido: str = "COMPLETO"
    ciclo_actual: Optional[int] = None

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    access_token = create_access_token(data={"sub": db_user.username, "role": db_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_role": db_user.role,
        "user_name": db_user.username,
    }

@router.post("/register", response_model=UserOut)
def register(user: UserCreateReq, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    if user.role == "estudiante":
        if user.ciclo_actual is None or not (1 <= user.ciclo_actual <= 10):
            raise HTTPException(status_code=400, detail="Ciclo inválido. Debe ser entre 1 y 10.")
        if user.turno_preferido not in ["MAÑANA", "TARDE", "COMPLETO"]:
            raise HTTPException(status_code=400, detail="Turno inválido.")
            
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        role=user.role,
        turno_preferido=user.turno_preferido,
        ciclo=user.ciclo_actual if user.role == "estudiante" else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/users/docentes", response_model=List[UserOut])
def get_docentes(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "docente").all()

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="No se puede eliminar al administrador")
    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado"}
