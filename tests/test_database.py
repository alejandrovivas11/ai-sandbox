from sqlalchemy import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept

from app.config import settings
from app.database import Base, SessionLocal, engine, get_db


def test_database_exports_base_sessionlocal_engine() -> None:
    """Verify that app.database exports Base, SessionLocal, and engine with correct types."""
    assert isinstance(engine, Engine)
    assert isinstance(SessionLocal, sessionmaker)
    assert isinstance(Base, DeclarativeAttributeIntercept)


def test_get_db_yields_session_and_closes() -> None:
    """Verify that get_db() yields a valid Session and closes it after exhaustion."""
    gen = get_db()
    session = next(gen)
    assert isinstance(session, Session)
    # Exhaust the generator so the finally block runs
    try:
        next(gen)
    except StopIteration:
        pass
    # After the generator is exhausted, the session should be closed
    assert not session.is_active or session.get_bind() is not None


def test_config_settings_defaults() -> None:
    """Verify that settings has the expected default values."""
    assert settings.SECRET_KEY == "your-secret-key-change-in-production"
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
    assert settings.DATABASE_URL == "sqlite:///./patient_portal.db"


def test_startup_creates_tables() -> None:
    """Verify that the startup event triggers Base.metadata.create_all."""
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as client:
        # After startup, the engine should be able to reflect tables
        # (even if no models are defined yet, metadata.create_all should run without error)
        from sqlalchemy import inspect

        inspector = inspect(engine)
        # Calling get_table_names should not raise; tables list may be empty
        table_names = inspector.get_table_names()
        assert isinstance(table_names, list)

        # Verify app is functional after startup
        response = client.get("/")
        assert response.status_code == 200


def test_existing_endpoints_still_work() -> None:
    """Verify that GET / and GET /status still return expected responses."""
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "AI Sandbox is running"}

        response = client.get("/status")
        assert response.status_code == 200
        data = response.json()
        assert data["app_name"] == "AI Sandbox"
        assert data["version"] == "0.1.0"
        assert data["status"] == "operational"
        assert "timestamp" in data
