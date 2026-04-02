from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import Settings, settings
from app.database import engine as db_engine, SessionLocal, Base, get_db
from app.main import app


def test_health_check_returns_200(client: TestClient) -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Sandbox is running"}


def test_config_settings_defaults() -> None:
    s = Settings()
    assert s.DATABASE_URL == "postgresql://postgres:postgres@localhost:5432/patient_mgmt"
    assert s.SECRET_KEY == "dev-secret-key"
    assert s.ALGORITHM == "HS256"
    assert s.ACCESS_TOKEN_EXPIRE_MINUTES == 30


def test_database_exports() -> None:
    assert isinstance(db_engine, Engine)
    assert isinstance(SessionLocal, sessionmaker)
    assert issubclass(Base, DeclarativeBase) or hasattr(Base, "metadata")
    assert callable(get_db)


def test_cors_middleware_present(client: TestClient) -> None:
    response = client.options(
        "/",
        headers={
            "Origin": "http://testserver",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert "access-control-allow-origin" in response.headers


def test_get_db_yields_session(db_session) -> None:
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1
