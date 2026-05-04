import pytest
from fastapi.testclient import TestClient

def test_get_users(client: TestClient):
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_docentes(client: TestClient):
    response = client.get("/api/auth/users/docentes")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_aulas(client: TestClient):
    response = client.get("/api/aulas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
