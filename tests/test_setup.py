from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

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
    assert s.ENVIRONMENT == "development"
    assert isinstance(s.CORS_ORIGINS, list)


def test_config_rejects_default_key_in_production() -> None:
    """SECRET_KEY validation must reject the default key in production."""
    import pytest

    with pytest.raises(ValueError, match="must be changed from the default"):
        Settings(ENVIRONMENT="production", SECRET_KEY="dev-secret-key")


def test_config_rejects_short_key_in_production() -> None:
    """SECRET_KEY validation must reject short keys in production."""
    import pytest

    with pytest.raises(ValueError, match="at least 32 characters"):
        Settings(ENVIRONMENT="production", SECRET_KEY="too-short")


def test_config_accepts_strong_key_in_production() -> None:
    """SECRET_KEY validation must accept a sufficiently strong key in production."""
    s = Settings(
        ENVIRONMENT="production",
        SECRET_KEY="a-very-long-and-secure-production-key-that-exceeds-32-chars",
    )
    assert s.ENVIRONMENT == "production"


def test_database_exports() -> None:
    assert isinstance(db_engine, Engine)
    assert isinstance(SessionLocal, sessionmaker)
    assert hasattr(Base, "metadata") and hasattr(Base, "registry"), (
        "Base should be a SQLAlchemy declarative base with metadata and registry attributes"
    )
    assert callable(get_db)


def test_cors_middleware_present(client: TestClient) -> None:
    response = client.options(
        "/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert "access-control-allow-origin" in response.headers


def test_cors_rejects_unknown_origin(client: TestClient) -> None:
    """CORS should not reflect an origin that is not in the allowed list."""
    response = client.options(
        "/",
        headers={
            "Origin": "http://malicious-site.example.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.headers.get("access-control-allow-origin") != "http://malicious-site.example.com"


def test_get_db_yields_session(db_session) -> None:
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1
