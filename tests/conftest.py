"""Shared test fixtures for the Patient Management API test suite.

Provides a TestClient, database initialization/teardown, and factory
helpers for creating patients and appointments via the API.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import storage


@pytest.fixture
def client() -> TestClient:
    """Return a TestClient instance wired to the FastAPI application."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    """Initialize a fresh SQLite database for each test.

    Creates all required tables (patients, appointments) with foreign key
    enforcement enabled, then clears all rows before and after each test
    so every test starts with an empty, clean database.
    """
    storage.init_db()

    conn = storage.get_connection()
    try:
        # Clear data in correct order (child tables first) to respect FK constraints
        conn.execute("DELETE FROM appointments")
        conn.execute("DELETE FROM patients")
        conn.commit()
    finally:
        conn.close()

    yield

    conn = storage.get_connection()
    try:
        conn.execute("DELETE FROM appointments")
        conn.execute("DELETE FROM patients")
        conn.commit()
    finally:
        conn.close()


@pytest.fixture
def sample_patient_data():
    """Return a callable factory that produces a default patient dict.

    The factory accepts optional keyword overrides to customize individual
    fields.  Unspecified fields use sensible defaults that satisfy the
    PatientCreate schema.
    """

    def _factory(**overrides: object) -> dict:
        defaults = {
            "first_name": "Jane",
            "last_name": "Doe",
            "date_of_birth": "1990-01-15",
            "gender": "female",
            "phone_number": "555-123-4567",
            "email": "jane.doe@example.com",
            "address": "123 Main St, Springfield, IL 62701",
        }
        defaults.update(overrides)
        return defaults

    return _factory


@pytest.fixture
def create_patient(client: TestClient, sample_patient_data):
    """Return a callable factory that POSTs to /patients/ and returns
    the response JSON.

    Accepts optional keyword overrides forwarded to sample_patient_data.
    Asserts that the response status is 201 Created.
    """

    def _factory(**overrides: object) -> dict:
        payload = sample_patient_data(**overrides)
        response = client.post("/patients/", json=payload)
        assert response.status_code == 201, (
            f"create_patient factory expected 201, got {response.status_code}"
        )
        return response.json()

    return _factory


@pytest.fixture
def create_appointment(client: TestClient, create_patient):
    """Return a callable factory that creates an appointment via the API.

    If no patient_id is provided, a new patient is created automatically.
    Accepts optional keyword overrides for the appointment payload.
    Uses the new SQLite-backed appointment schema with doctor_name and
    datetime fields.  Asserts that the response status is 201 Created.
    """

    def _factory(
        patient_id: str | None = None,
        **overrides: object,
    ) -> dict:
        if patient_id is None:
            patient = create_patient()
            patient_id = patient["id"]

        defaults = {
            "patient_id": patient_id,
            "doctor_name": "Dr. Smith",
            "datetime": "2025-12-15T10:00:00",
        }
        defaults.update(overrides)
        response = client.post("/appointments/", json=defaults)
        assert response.status_code == 201, (
            f"create_appointment factory expected 201, got {response.status_code}"
        )
        return response.json()

    return _factory
