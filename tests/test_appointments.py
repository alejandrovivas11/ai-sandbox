"""Tests for appointment endpoints and contract specifications.

These tests validate that the appointment management system adheres to
the contract specifications including integer patient_id fields,
proper HTTP status codes, and storage JOIN operations.

RED phase: these tests are expected to FAIL against the current
implementation, which uses string UUIDs for patient_id, lacks conflict
detection, and does not return the correct HTTP status codes.
"""

from fastapi.testclient import TestClient

from app.models.appointment import AppointmentCreate
from app.services import appointment_service


def test_appointment_model_uses_integer_patient_id() -> None:
    """Verify Appointment model accepts and stores integer patient_id
    values instead of string UUIDs."""
    # Arrange
    appointment_data = {
        "patient_id": 1,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    appointment = AppointmentCreate(**appointment_data)

    # Assert
    assert isinstance(appointment.patient_id, int), (
        "patient_id should be an integer, got "
        f"{type(appointment.patient_id).__name__}"
    )
    assert appointment.patient_id == 1, (
        "patient_id should equal the integer value 1"
    )


def test_create_appointment_accepts_integer_patient_id(
    client: TestClient,
) -> None:
    """Verify POST /appointments endpoint accepts integer patient_id
    and returns appointment with integer patient_id."""
    # Arrange -- create a patient first to obtain a valid patient_id
    patient_resp = client.post(
        "/patients/",
        json={
            "first_name": "Jane",
            "last_name": "Doe",
            "date_of_birth": "1990-01-15",
            "gender": "female",
            "phone_number": "555-123-4567",
        },
    )
    assert patient_resp.status_code == 201
    patient_id = patient_resp.json()["id"]

    appointment_payload = {
        "patient_id": patient_id,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=appointment_payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    data = response.json()
    assert isinstance(data["patient_id"], int), (
        "Response patient_id should be an integer, got "
        f"{type(data['patient_id']).__name__}"
    )


def test_get_appointment_returns_integer_patient_id(
    client: TestClient,
    create_appointment,
) -> None:
    """Verify GET /appointments/{id} endpoint returns appointment data
    with integer patient_id field."""
    # Arrange
    appointment = create_appointment()
    appointment_id = appointment["id"]

    # Act
    response = client.get(f"/appointments/{appointment_id}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert isinstance(data["patient_id"], int), (
        "GET response patient_id should be an integer, got "
        f"{type(data['patient_id']).__name__}"
    )


def test_storage_join_returns_patient_data_with_appointments(
    client: TestClient,
    create_patient,
    create_appointment,
) -> None:
    """Verify storage layer JOIN operations return patient information
    alongside appointment data when queried."""
    # Arrange
    patient = create_patient()
    patient_id = patient["id"]
    appointment = create_appointment(patient_id=patient_id)
    appointment_id = appointment["id"]

    # Act
    result = appointment_service.get_appointment_with_patient(appointment_id)

    # Assert
    assert result is not None, "JOIN query should return a result"
    assert "patient_id" in result, (
        "Result should contain patient_id field"
    )
    assert "first_name" in result or "patient" in result, (
        "Result should contain patient data from JOIN operation"
    )


def test_service_validates_integer_patient_id_foreign_key() -> None:
    """Verify appointment service validates that patient_id references
    an existing patient record and rejects invalid integers."""
    # Arrange
    invalid_patient_id = 99999

    # Act
    result = appointment_service.patient_exists(invalid_patient_id)

    # Assert
    assert result is False, (
        "patient_exists should return False for non-existent integer patient_id"
    )
    # Verify the model accepts integer patient_id natively (not coerced to str)
    appointment_data = AppointmentCreate(
        patient_id=invalid_patient_id,
        date_time="2025-12-15T10:00:00",
        appointment_type="checkup",
    )
    assert isinstance(appointment_data.patient_id, int), (
        "AppointmentCreate should accept and store integer patient_id, "
        f"got {type(appointment_data.patient_id).__name__}"
    )


def test_appointment_not_found_returns_404(client: TestClient) -> None:
    """Verify GET /appointments/{non_existent_id} returns exactly
    HTTP 404 status code as specified in contract."""
    # Arrange
    non_existent_id = 99999

    # Act
    response = client.get(f"/appointments/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )


def test_scheduling_conflict_returns_409(
    client: TestClient,
    create_patient,
    create_appointment,
) -> None:
    """Verify creating appointment with time conflict returns exactly
    HTTP 409 status code as specified in contract."""
    # Arrange -- create a patient and an initial appointment
    patient = create_patient()
    patient_id = patient["id"]
    create_appointment(
        patient_id=patient_id,
        date_time="2025-12-15T10:00:00",
        appointment_type="checkup",
    )

    # Act -- attempt to create a conflicting appointment at the same time
    conflict_payload = {
        "patient_id": patient_id,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "follow-up",
    }
    response = client.post("/appointments/", json=conflict_payload)

    # Assert
    assert response.status_code == 409, (
        "Expected 409 Conflict for overlapping appointment, "
        f"got {response.status_code}"
    )


def test_invalid_patient_id_returns_422(client: TestClient) -> None:
    """Verify appointment creation with non-existent patient_id returns
    exactly HTTP 422 status code as specified in contract."""
    # Arrange
    payload = {
        "patient_id": 99999,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 422, (
        "Expected 422 Unprocessable Entity for non-existent patient_id, "
        f"got {response.status_code}"
    )


def test_invalid_appointment_data_returns_422(client: TestClient) -> None:
    """Verify appointment creation with invalid datetime format returns
    exactly HTTP 422 status code as specified in contract."""
    # Arrange
    payload = {
        "patient_id": 1,
        "date_time": "not-a-valid-datetime",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 422, (
        "Expected 422 Unprocessable Entity for invalid datetime format, "
        f"got {response.status_code}"
    )


def test_update_appointment_with_integer_patient_id(
    client: TestClient,
    create_patient,
    create_appointment,
) -> None:
    """Verify PUT /appointments/{id} endpoint accepts integer patient_id
    and updates appointment successfully."""
    # Arrange
    patient = create_patient()
    patient_id = patient["id"]
    appointment = create_appointment(patient_id=patient_id)
    appointment_id = appointment["id"]

    new_patient = create_patient(
        first_name="John",
        last_name="Smith",
        email="john.smith@example.com",
    )
    new_patient_id = new_patient["id"]

    update_payload = {
        "patient_id": new_patient_id,
    }

    # Act
    response = client.put(
        f"/appointments/{appointment_id}", json=update_payload
    )

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert isinstance(data["patient_id"], int), (
        "Updated appointment patient_id should be an integer, got "
        f"{type(data['patient_id']).__name__}"
    )
    assert data["patient_id"] == new_patient_id, (
        f"Expected patient_id {new_patient_id}, got {data['patient_id']}"
    )


def test_delete_nonexistent_appointment_returns_404(
    client: TestClient,
) -> None:
    """Verify DELETE /appointments/{non_existent_id} returns exactly
    HTTP 404 status code as specified in contract."""
    # Arrange
    non_existent_id = 99999

    # Act
    response = client.delete(f"/appointments/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
