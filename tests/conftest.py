import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import storage


@pytest.fixture
def client() -> TestClient:
    """Return a TestClient instance wired to the FastAPI application."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_storage():
    """Clear in-memory storage before and after every test for full isolation."""
    storage.reset()
    yield
    storage.reset()


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
    Defaults: date_time='2025-12-15T10:00:00', appointment_type='checkup'.
    Asserts that the response status is 201 Created.
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
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "checkup",
        }
        defaults.update(overrides)
        response = client.post("/appointments/", json=defaults)
        assert response.status_code == 201, (
            f"create_appointment factory expected 201, got {response.status_code}"
        )
        return response.json()

    return _factory
