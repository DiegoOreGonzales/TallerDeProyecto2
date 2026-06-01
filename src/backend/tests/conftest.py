import pytest
import os

# Establecer DATABASE_URL por defecto para evitar cargar psycopg2
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

# Solo configurar DB si no estamos ejecutando tests aislados
# Los tests de test_optimization_model.py no requieren DB
if os.environ.get("SKIP_DB_SETUP") != "1":
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker
        from fastapi.testclient import TestClient

        from app.database import Base, get_db
        from app.main import app

        # Base de datos en memoria para pruebas
        SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

        engine = create_engine(
            SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
        )
        TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

        @pytest.fixture(scope="function")
        def db_session():
            # Crear tablas
            Base.metadata.create_all(bind=engine)
            db = TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()
                # Limpiar tablas despues de cada prueba
                Base.metadata.drop_all(bind=engine)

        @pytest.fixture(scope="function")
        def client(db_session):
            def override_get_db():
                try:
                    yield db_session
                finally:
                    pass
            app.dependency_overrides[get_db] = override_get_db
            yield TestClient(app)
            # Limpiar overrides
            del app.dependency_overrides[get_db]
    except Exception:
        # Si falla la conexión a DB, los tests de modelo aún funcionan
        pass
