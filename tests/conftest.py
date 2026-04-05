"""
Shared pytest fixtures for the clinic management system test suite.

Provides: test database (SQLite in-memory), TestClient with dependency overrides,
admin user seeding, auth headers, and helper fixtures for creating patients
and appointments.
"""

import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.dependencies import get_db
from app.main import app

# ---------------------------------------------------------------------------
# Database fixtures
# ---------------------------------------------------------------------------

SQLALCHEMY_TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(scope="session")
def engine():
    """Create a SQLite in-memory engine shared across the entire test session."""
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def db_session(engine):
    """Provide a transactional database session that rolls back after each test."""
    connection = engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(bind=connection)
    session = TestingSessionLocal()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db_session):
    """FastAPI TestClient with the get_db dependency overridden to use the test session."""

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Auth / user fixtures
# ---------------------------------------------------------------------------

@pytest.fixture()
def seed_admin(db_session):
    """Seed the database with the default admin user and return the user instance."""
    from app.auth.models import User
    from app.auth.security import hash_password

    admin = User(
        id=uuid.uuid4(),
        email="admin@clinic.com",
        hashed_password=hash_password("admin123"),
        full_name="Admin User",
        is_active=True,
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture()
def auth_headers(client, seed_admin) -> dict[str, str]:
    """Log in as the seeded admin user and return Authorization headers with Bearer token."""
    response = client.post(
        "/api/auth/login",
        data={"username": "admin@clinic.com", "password": "admin123"},
    )
    assert response.status_code == 200, (
        f"Admin login failed during fixture setup: {response.text}"
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Domain helper fixtures
# ---------------------------------------------------------------------------

@pytest.fixture()
def sample_patient_data() -> dict:
    """Return a dictionary of valid patient creation data."""
    return {
        "first_name": "Jane",
        "last_name": "Doe",
        "date_of_birth": "1990-05-15",
        "gender": "female",
        "phone": "555-0100",
        "email": "jane.doe@example.com",
        "address": "123 Main St",
    }


@pytest.fixture()
def created_patient(client, auth_headers, sample_patient_data) -> dict:
    """Create a patient via the API and return the response JSON."""
    response = client.post(
        "/api/patients",
        json=sample_patient_data,
        headers=auth_headers,
    )
    assert response.status_code == 201, (
        f"Patient creation failed during fixture setup: {response.text}"
    )
    return response.json()


@pytest.fixture()
def sample_appointment_data(created_patient) -> dict:
    """Return a dictionary of valid appointment creation data referencing the created patient."""
    return {
        "patient_id": created_patient["id"],
        "appointment_date": "2024-06-15",
        "appointment_time": "09:30:00",
        "duration_minutes": 30,
        "reason": "Routine check-up",
        "notes": "First visit",
    }


@pytest.fixture()
def created_appointment(client, auth_headers, sample_appointment_data) -> dict:
    """Create an appointment via the API and return the response JSON."""
    response = client.post(
        "/api/appointments",
        json=sample_appointment_data,
        headers=auth_headers,
    )
    assert response.status_code == 201, (
        f"Appointment creation failed during fixture setup: {response.text}"
    )
    return response.json()
