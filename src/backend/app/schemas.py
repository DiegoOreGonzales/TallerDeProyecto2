from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str
    turno_preferido: str = "COMPLETO"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# --- Aula Schemas ---
class AulaBase(BaseModel):
    nombre: str
    capacidad: int
    tipo: str

class AulaCreate(AulaBase):
    pass

class Aula(AulaBase):
    id: int
    class Config:
        from_attributes = True

# --- Curso Schemas ---
class CursoBase(BaseModel):
    codigo: str
    nombre: str
    creditos: int
    tipo: str = "Teoría"
    periodo: int = 1

class CursoCreate(CursoBase):
    pass

class Curso(CursoBase):
    id: int
    class Config:
        from_attributes = True

# --- Seccion Schemas ---
class SeccionBase(BaseModel):
    codigo: str
    curso_id: int
    docente_id: int
    capac_estimada: int
    turno: str = "COMPLETO"

class SeccionCreate(SeccionBase):
    pass

class Seccion(SeccionBase):
    id: int
    curso: Optional[Curso] = None
    docente: Optional[User] = None
    class Config:
        from_attributes = True

# --- Horario Schemas ---
class HorarioBase(BaseModel):
    seccion_id: int
    aula_id: int
    dia_semana: int
    bloque: int

class HorarioCreate(HorarioBase):
    pass

class Horario(HorarioBase):
    id: int
    seccion: Optional[Seccion] = None
    aula: Optional[Aula] = None
    class Config:
        from_attributes = True
