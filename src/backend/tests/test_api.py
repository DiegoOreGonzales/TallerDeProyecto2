"""
Tests de integración para los endpoints CRUD de la API SGOHA.
Cubre todos los endpoints con casos de éxito.
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
# AUTH
# ============================================================

def test_login_success(client: TestClient):
    """Login exitoso: registrar usuario, luego loguear."""
    # Registrar un usuario primero
    reg = _register_user(client, "test_login_user", "test_login@test.com", "pass123", "docente", "MAÑANA")
    assert reg.status_code == 200

    # Loguear con esas credenciales
    response = client.post(
        "/api/auth/login",
        json={"username": "test_login_user", "password": "pass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_role"] == "docente"
    assert data["user_name"] == "test_login_user"


def test_login_failure(client: TestClient):
    """Login con credenciales inválidas debe retornar 401."""
    response = client.post(
        "/api/auth/login",
        json={"username": "nonexistent_user", "password": "wrong_password"}
    )
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]


def test_get_users(client: TestClient):
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_docentes(client: TestClient):
    """Listar docentes: registrar uno y verificar que aparece."""
    # Registrar un docente
    _register_user(client, "doc_list_test", "doc_list@test.com", "pass123", "docente", "TARDE")

    response = client.get("/api/auth/users/docentes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Al menos nuestro docente debe estar
    usernames = [u["username"] for u in data]
    assert "doc_list_test" in usernames


# ============================================================
# AULAS
# ============================================================

def test_get_aulas(client: TestClient):
    response = client.get("/api/aulas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_post_aula(client: TestClient):
    """Crear un aula correctamente."""
    response = client.post(
        "/api/aulas/",
        json={"nombre": "A-TEST-99", "capacidad": 40, "tipo": "Teoría"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "A-TEST-99"
    assert data["capacidad"] == 40
    assert data["tipo"] == "Teoría"
    assert "id" in data


def test_delete_aula(client: TestClient):
    """Eliminar un aula existente."""
    created = client.post(
        "/api/aulas/",
        json={"nombre": "A-TEST-TO-DELETE", "capacidad": 30, "tipo": "Laboratorio"}
    ).json()
    aula_id = created["id"]

    response = client.delete(f"/api/aulas/{aula_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Aula eliminada"


# ============================================================
# CURSOS
# ============================================================

def test_get_cursos(client: TestClient):
    response = client.get("/api/cursos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_post_curso(client: TestClient):
    """Crear un curso correctamente."""
    response = client.post(
        "/api/cursos/",
        json={
            "codigo": "TEST-CURSO-001",
            "nombre": "Curso Test",
            "creditos": 4,
            "tipo": "Teoría",
            "periodo": 5
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["codigo"] == "TEST-CURSO-001"
    assert data["nombre"] == "Curso Test"
    assert data["creditos"] == 4
    assert "id" in data


def test_get_curso_by_id(client: TestClient):
    """Obtener un curso por su ID."""
    created = client.post(
        "/api/cursos/",
        json={
            "codigo": "TEST-CURSO-002",
            "nombre": "Curso Test ID",
            "creditos": 3,
            "tipo": "Laboratorio",
            "periodo": 7
        }
    ).json()
    curso_id = created["id"]

    response = client.get(f"/api/cursos/{curso_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == curso_id
    assert data["codigo"] == "TEST-CURSO-002"


def test_delete_curso(client: TestClient):
    """Eliminar un curso existente."""
    created = client.post(
        "/api/cursos/",
        json={
            "codigo": "TEST-CURSO-TO-DELETE",
            "nombre": "Curso a Eliminar",
            "creditos": 2,
            "tipo": "Teoría",
            "periodo": 1
        }
    ).json()
    curso_id = created["id"]

    response = client.delete(f"/api/cursos/{curso_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Curso eliminado"


# ============================================================
# SECCIONES
# ============================================================

def test_get_secciones(client: TestClient):
    response = client.get("/api/secciones/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_post_seccion(client: TestClient):
    """Crear una sección: necesita curso y docente existentes."""
    # Crear curso
    curso = client.post(
        "/api/cursos/",
        json={
            "codigo": "TEST-SEC-CURSO",
            "nombre": "Curso para Sección",
            "creditos": 3,
            "tipo": "Teoría",
            "periodo": 5
        }
    ).json()

    # Crear docente
    docente = _register_user(
        client, "docente_sec_test", "docente_sec@test.com", "pass123", "docente", "MAÑANA"
    ).json()
    docente_id = docente["id"]

    # Crear sección
    response = client.post(
        "/api/secciones/",
        json={
            "codigo": "TEST-SEC-001",
            "curso_id": curso["id"],
            "docente_id": docente_id,
            "capac_estimada": 30,
            "turno": "MAÑANA"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["codigo"] == "TEST-SEC-001"
    assert data["curso_id"] == curso["id"]
    assert data["docente_id"] == docente_id
    assert "id" in data


# ============================================================
# SCHEDULER
# ============================================================

def test_get_schedules(client: TestClient):
    """Obtener horarios (puede estar vacío)."""
    response = client.get("/api/scheduler/")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)


def test_get_stats(client: TestClient):
    """Obtener KPIs del dashboard."""
    response = client.get("/api/scheduler/stats")
    assert response.status_code == 200
    data = response.json()
    assert "cursos" in data
    assert "aulas" in data
    assert "secciones" in data
    assert "docentes" in data
    assert "horarios_generados" in data
    for v in data.values():
        assert isinstance(v, int)
        assert v >= 0
