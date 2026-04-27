import pytest
from fastapi.testclient import TestClient

def test_register_docente_success(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "prof_test",
            "email": "prof@test.com",
            "password": "password123",
            "role": "docente",
            "turno_preferido": "MAÑANA"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "prof_test"
    assert data["role"] == "docente"

def test_register_estudiante_success(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "estud_test",
            "email": "estud@test.com",
            "password": "password123",
            "role": "estudiante",
            "turno_preferido": "TARDE",
            "ciclo_actual": 5
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "estud_test"
    assert data["role"] == "estudiante"
    # El turno preferido se guarda como turno y el ciclo como ciclo

def test_register_estudiante_invalid_ciclo(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "estud_fail1",
            "email": "fail1@test.com",
            "password": "password123",
            "role": "estudiante",
            "turno_preferido": "TARDE",
            "ciclo_actual": 11 # Invalido
        }
    )
    assert response.status_code == 400
    assert "Ciclo inválido" in response.json()["detail"]

def test_register_estudiante_missing_ciclo(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "estud_fail2",
            "email": "fail2@test.com",
            "password": "password123",
            "role": "estudiante",
            "turno_preferido": "TARDE"
            # Falta ciclo
        }
    )
    assert response.status_code == 400
    assert "Ciclo inválido" in response.json()["detail"]
