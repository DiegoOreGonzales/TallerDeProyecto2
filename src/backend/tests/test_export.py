"""
Tests de exportación para los endpoints PDF e iCal de SGOHA.
Cubre casos de error (sin horarios) y casos de éxito (con datos).
"""
import pytest
from fastapi.testclient import TestClient
from app import models


def test_export_pdf_no_horarios(client: TestClient):
    """Exportar PDF sin horarios generados debe dar 404."""
    response = client.get("/api/export/pdf")
    assert response.status_code == 404
    assert "no hay horarios" in response.json()["detail"].lower()


def test_export_pdf_by_ciclo_no_horarios(client: TestClient):
    """Exportar PDF por ciclo sin horarios debe dar 404."""
    response = client.get("/api/export/pdf/ciclo/5")
    assert response.status_code == 404


def test_export_ical_no_horarios(client: TestClient):
    """Exportar iCal sin horarios debe dar 404."""
    response = client.get("/api/export/ical/ciclo/5")
    assert response.status_code == 404


def test_export_pdf_generated(client: TestClient, db_session):
    """Exportar PDF después de crear datos debe dar 200 + Content-Type PDF."""
    _seed_horario_data(db_session)

    response = client.get("/api/export/pdf")
    assert response.status_code == 200
    assert response.headers.get("content-type", "").startswith("application/pdf")
    cd = response.headers.get("content-disposition", "")
    assert "attachment; filename=" in cd


def test_export_pdf_by_ciclo_generated(client: TestClient, db_session):
    """Exportar PDF por ciclo con datos existentes debe dar 200."""
    _seed_horario_data(db_session)

    response = client.get("/api/export/pdf/ciclo/5")
    assert response.status_code == 200
    assert response.headers.get("content-type", "").startswith("application/pdf")


def test_export_ical_generated(client: TestClient, db_session):
    """Exportar iCal con datos existentes debe dar 200 + estructura iCal."""
    _seed_horario_data(db_session)

    response = client.get("/api/export/ical/ciclo/5")
    assert response.status_code == 200
    assert response.headers.get("content-type", "").startswith("text/calendar")
    content = response.text
    assert "BEGIN:VCALENDAR" in content
    assert "END:VCALENDAR" in content
    assert "VERSION:2.0" in content


def test_export_ical_different_ciclo(client: TestClient, db_session):
    """Exportar iCal para un ciclo sin datos debe dar 404."""
    # Seed con datos del ciclo 5
    _seed_horario_data(db_session)

    # Consultar ciclo 1 (sin datos)
    response = client.get("/api/export/ical/ciclo/1")
    assert response.status_code == 404


# ============================================================
# HELPERS
# ============================================================

def _seed_horario_data(db_session):
    """
    Crea datos mínimos para probar exportación.
    - 1 usuario admin
    - 1 aula
    - 1 curso (periodo 5)
    - 1 sección
    - 1 horario
    """
    from app.auth import get_password_hash

    # Crear usuario admin
    admin = models.User(
        username="admin_export",
        email="admin_export@test.com",
        hashed_password=get_password_hash("test"),
        role="admin",
        turno_preferido="COMPLETO",
    )
    db_session.add(admin)
    db_session.flush()

    # Crear docente
    docente = models.User(
        username="docente_export",
        email="docente_export@test.com",
        hashed_password=get_password_hash("test"),
        role="docente",
        turno_preferido="COMPLETO",
    )
    db_session.add(docente)
    db_session.flush()

    # Crear aula
    aula = models.Aula(nombre="A-EXPORT", capacidad=40, tipo="Teoría")
    db_session.add(aula)
    db_session.flush()

    # Crear curso (periodo 5)
    curso = models.Curso(
        codigo="EXPORT-CURSO",
        nombre="Curso Export Test",
        creditos=3,
        tipo="Teoría",
        periodo=5,
    )
    db_session.add(curso)
    db_session.flush()

    # Crear sección
    seccion = models.Seccion(
        codigo="EXPORT-SEC-M",
        curso_id=curso.id,
        docente_id=docente.id,
        capac_estimada=30,
        turno="MAÑANA",
    )
    db_session.add(seccion)
    db_session.flush()

    # Crear horario
    horario = models.Horario(
        seccion_id=seccion.id,
        aula_id=aula.id,
        dia_semana=0,  # Lunes
        bloque=0,      # Slot 0 (07:00-08:30)
    )
    db_session.add(horario)
    db_session.commit()
