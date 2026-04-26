from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from .database import Base

# Tabla intermedia para prerrequisitos
prerrequisitos = Table(
    'prerrequisitos',
    Base.metadata,
    Column('curso_id', Integer, ForeignKey('cursos.id'), primary_key=True),
    Column('prerrequisito_id', Integer, ForeignKey('cursos.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # admin, docente, estudiante
    is_active = Column(Boolean, default=True)
    # Preferencia de turno para docentes: MAÑANA, TARDE, COMPLETO
    turno_preferido = Column(String, default="COMPLETO")
    
    secciones = relationship("Seccion", back_populates="docente")

class Aula(Base):
    __tablename__ = "aulas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    capacidad = Column(Integer)
    tipo = Column(String)  # Teoría, Laboratorio, Taller
    
    horarios = relationship("Horario", back_populates="aula")

class Curso(Base):
    __tablename__ = "cursos"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True)
    nombre = Column(String)
    creditos = Column(Integer)       # 1 crédito = 1 bloque de 1.5h semanal
    tipo = Column(String, default="Teoría")  # Teoría, Laboratorio
    periodo = Column(Integer, default=1)     # Período académico (1-10)
    
    secciones = relationship("Seccion", back_populates="curso")
    
    required_by = relationship(
        "Curso",
        secondary=prerrequisitos,
        primaryjoin=id==prerrequisitos.c.curso_id,
        secondaryjoin=id==prerrequisitos.c.prerrequisito_id,
        backref="prerequisites"
    )

class Seccion(Base):
    __tablename__ = "secciones"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True)
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    docente_id = Column(Integer, ForeignKey("users.id"))
    capac_estimada = Column(Integer)
    # Turno de la sección: MAÑANA, TARDE, COMPLETO
    turno = Column(String, default="COMPLETO")
    
    curso = relationship("Curso", back_populates="secciones")
    docente = relationship("User", back_populates="secciones")
    horarios = relationship("Horario", back_populates="seccion")

class Horario(Base):
    __tablename__ = "horarios"
    id = Column(Integer, primary_key=True, index=True)
    seccion_id = Column(Integer, ForeignKey("secciones.id"))
    aula_id = Column(Integer, ForeignKey("aulas.id"))
    
    dia_semana = Column(Integer)  # 0-5 (Lunes-Sábado)
    bloque = Column(Integer)      # 0-8 (slot index)
    
    seccion = relationship("Seccion", back_populates="horarios")
    aula = relationship("Aula", back_populates="horarios")
