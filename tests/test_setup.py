from app.main import app
from app.config import settings
from app.database import get_db


def test_root_endpoint_returns_200(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Patient Portal API" in data["message"]


def test_docs_endpoint_returns_200(client):
    response = client.get("/docs")
    assert response.status_code == 200


def test_app_title_is_patient_portal_api():
    assert app.title == "Patient Portal API"


def test_config_defaults():
    assert settings.DATABASE_URL == "sqlite:///./patient_portal.db"
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30


def test_get_db_yields_session():
    gen = get_db()
    session = next(gen)
    assert session is not None
    assert hasattr(session, "execute")
    assert hasattr(session, "commit")
    try:
        next(gen)
    except StopIteration:
        pass
