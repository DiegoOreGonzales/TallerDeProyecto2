"""
Tests de validaciones, errores y casos borde para los endpoints API.
Cubre códigos de error 400, 403, 404 y 422.
"""
import pytest
from fastapi.testclient import TestClient


# ============================================================
# HELPERS
# ============================================================

def _register_user(client, username, email, password, role, turno="COMPLETO", ciclo=None):
    """Helper para registrar usuarios en los tests."""
    payload = {
        "username": username,
        "email": email,
        "password": password,
        "role": role,
        "turno_preferido": turno,
    }
    if ciclo is not None:
        payload["ciclo_actual"] = ciclo
    return client.post("/api/auth/register", json=payload)


# ============================================================
# AUTH — Validaciones de registro
# ============================================================

def test_register_duplicate_username(client: TestClient):
    """Registrar con username existente debe dar 400."""
    _register_user(client, "dup_user", "dup1@test.com", "test123", "docente", "MAÑANA")

    response = _register_user(client, "dup_user", "dup2@test.com", "test123", "docente", "TARDE")
    assert response.status_code == 400
    assert "ya existe" in response.json()["detail"].lower()


def test_register_invalid_ciclo_estudiante(client: TestClient):
    """Estudiante con ciclo > 10 debe dar 400."""
    response = _register_user(
        client, "estu_bad_ciclo", "bad_ciclo@test.com", "test123",
        "estudiante", "MAÑANA", ciclo=15
    )
    assert response.status_code == 400
    assert "Ciclo inválido" in response.json()["detail"]


def test_register_invalid_turno(client: TestClient):
    """Estudiante con turno inválido debe dar 400."""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "estu_bad_turno",
            "email": "bad_turno@test.com",
            "password": "test123",
            "role": "estudiante",
            "turno_preferido": "NOCTURNO",
            "ciclo_actual": 5
        }
    )
    assert response.status_code == 400
    assert "Turno inválido" in response.json()["detail"]


# ============================================================
# AUTH — Eliminación de usuarios
# ============================================================

def test_delete_user_admin_protected(client: TestClient):
    """Eliminar al administrador debe dar 403."""
    # Crear un admin explícitamente
    admin = _register_user(
        client, "admin_protected", "admin_protected@test.com", "admin123", "admin"
    ).json()
    admin_id = admin["id"]

    # Intentar eliminar al admin
    response = client.delete(f"/api/auth/users/{admin_id}")
    assert response.status_code == 403
    assert "administrador" in response.json()["detail"].lower()


def test_delete_nonexistent_user(client: TestClient):
    """Eliminar usuario inexistente debe dar 404."""
    response = client.delete("/api/auth/users/99999")
    assert response.status_code == 404
    assert "no encontrado" in response.json()["detail"].lower()


# ============================================================
# CURSOS — Validaciones
# ============================================================

def test_create_curso_duplicate_codigo(client: TestClient):
    """Crear curso con código duplicado debe dar 400."""
    client.post(
        "/api/cursos/",
        json={
            "codigo": "DUP-CURSO",
            "nombre": "Curso Original",
            "creditos": 3,
            "tipo": "Teoría",
            "periodo": 1
        }
    )
    response = client.post(
        "/api/cursos/",
        json={
            "codigo": "DUP-CURSO",
            "nombre": "Curso Duplicado",
            "creditos": 4,
            "tipo": "Laboratorio",
            "periodo": 2
        }
    )
    assert response.status_code == 400
    assert "ya existe" in response.json()["detail"]


def test_get_curso_not_found(client: TestClient):
    """Obtener curso por ID inexistente debe dar 404."""
    response = client.get("/api/cursos/99999")
    assert response.status_code == 404
    assert "no encontrado" in response.json()["detail"]


def test_get_curso_invalid_id(client: TestClient):
    """Obtener curso con ID no numérico debe dar 422."""
    response = client.get("/api/cursos/abc")
    assert response.status_code == 422


def test_delete_nonexistent_curso(client: TestClient):
    """Eliminar curso inexistente debe dar 404."""
    response = client.delete("/api/cursos/99999")
    assert response.status_code == 404


# ============================================================
# AULAS — Validaciones
# ============================================================

def test_create_aula_duplicate_nombre(client: TestClient):
    """Crear aula con nombre duplicado debe dar 400."""
    client.post(
        "/api/aulas/",
        json={"nombre": "AULA-DUP", "capacidad": 40, "tipo": "Teoría"}
    )
    response = client.post(
        "/api/aulas/",
        json={"nombre": "AULA-DUP", "capacidad": 30, "tipo": "Laboratorio"}
    )
    assert response.status_code == 400
    assert "ya existe" in response.json()["detail"]


def test_delete_nonexistent_aula(client: TestClient):
    """Eliminar aula inexistente debe dar 404."""
    response = client.delete("/api/aulas/99999")
    assert response.status_code == 404


# ============================================================
# SECCIONES — Validaciones
# ============================================================

def test_delete_nonexistent_seccion(client: TestClient):
    """Eliminar sección inexistente debe dar 404."""
    response = client.delete("/api/secciones/99999")
    assert response.status_code == 404
