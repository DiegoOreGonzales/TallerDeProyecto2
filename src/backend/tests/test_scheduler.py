import pytest
from app.models import Aula, Curso, Seccion, User
from app.core.scheduler import generate_schedule

def test_scheduler_factible(db_session):
    # Crear datos mínimos
    docente = User(username="docente1", email="d1@test.com", hashed_password="pw", role="docente", turno_preferido="COMPLETO")
    db_session.add(docente)
    db_session.commit()
    
    aula = Aula(nombre="A-101", capacidad=40, tipo="Teoría")
    db_session.add(aula)
    db_session.commit()
    
    curso = Curso(codigo="C01", nombre="Matemática", creditos=2, tipo="Teoría", periodo=1)
    db_session.add(curso)
    db_session.commit()
    
    seccion = Seccion(codigo="S1", curso_id=curso.id, docente_id=docente.id, capac_estimada=30, turno="COMPLETO")
    db_session.add(seccion)
    db_session.commit()
    
    # Generar horario
    result = generate_schedule(db_session)
    assert result["status"] == "success"
    # Debe generar 2 bloques (creditos=2)
    assert len(result["horarios"]) == 2
    assert result["horarios"][0]["seccion_id"] == seccion.id
    assert result["horarios"][0]["aula_id"] == aula.id

def test_scheduler_infactible_capacidad(db_session):
    docente = User(username="docente2", email="d2@test.com", hashed_password="pw", role="docente", turno_preferido="COMPLETO")
    db_session.add(docente)
    
    aula = Aula(nombre="A-Pequeña", capacidad=20, tipo="Teoría") # Aula chica
    db_session.add(aula)
    db_session.commit()
    
    curso = Curso(codigo="C02", nombre="Física", creditos=2, tipo="Teoría", periodo=1)
    db_session.add(curso)
    db_session.commit()
    
    seccion = Seccion(codigo="S2", curso_id=curso.id, docente_id=docente.id, capac_estimada=40, turno="COMPLETO") # Muchos alumnos
    db_session.add(seccion)
    db_session.commit()
    
    # Debe fallar porque el aula (20) no soporta la seccion (40)
    result = generate_schedule(db_session)
    assert result["status"] == "error"
    assert "Infactible" in result["message"]
