"""Tests for appointment endpoints and contract specifications.

These tests validate that the appointment management system adheres to
the contract specifications including integer IDs for both patients and
appointments, proper HTTP status codes, SQL-based storage with JOIN
operations, scheduling conflict detection, and filtering support.
"""

from fastapi.testclient import TestClient

from app.models.appointment import AppointmentCreate, AppointmentStatus
from app.services import appointment_service
from app.storage import get_storage


# -------------------------------------------------------------------- #
#  Model & integer ID type tests                                        #
# -------------------------------------------------------------------- #


def test_appointment_model_uses_integer_patient_id() -> None:
    """Verify Appointment model accepts and stores integer patient_id
    values instead of string UUIDs."""
    appointment_data = {
        "patient_id": 1,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }
    appointment = AppointmentCreate(**appointment_data)
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
    and returns appointment with integer patient_id and integer id."""
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

    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient_id,
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "checkup",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert isinstance(data["patient_id"], int), (
        "Response patient_id should be an integer"
    )
    assert isinstance(data["id"], int), (
        "Response id should be an integer, not a UUID string"
    )


def test_get_appointment_returns_integer_patient_id(
    client: TestClient,
    create_appointment,
) -> None:
    """Verify GET /appointments/{id} endpoint returns appointment data
    with integer patient_id and integer id fields."""
    appointment = create_appointment()
    appointment_id = appointment["id"]

    response = client.get(f"/appointments/{appointment_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["patient_id"], int)
    assert isinstance(data["id"], int)


# -------------------------------------------------------------------- #
#  Comprehensive CRUD tests with integer IDs                            #
# -------------------------------------------------------------------- #


def test_create_appointment_returns_all_fields(
    client: TestClient,
    create_patient,
) -> None:
    """Verify POST /appointments/ returns all expected fields with
    correct types and values."""
    patient = create_patient()
    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient["id"],
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "checkup",
            "duration_minutes": 45,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert isinstance(data["id"], int)
    assert data["patient_id"] == patient["id"]
    assert data["appointment_type"] == "checkup"
    assert data["duration_minutes"] == 45
    assert data["status"] == "scheduled"
    assert "created_at" in data
    assert "updated_at" in data


def test_list_appointments(
    client: TestClient, create_appointment
) -> None:
    """Verify GET /appointments/ returns a list of all appointments."""
    create_appointment(date_time="2025-12-15T10:00:00")
    create_appointment(date_time="2025-12-16T10:00:00")
    response = client.get("/appointments/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    for appt in data:
        assert isinstance(appt["id"], int)
        assert isinstance(appt["patient_id"], int)


def test_update_appointment_fields(
    client: TestClient, create_appointment
) -> None:
    """Verify PUT /appointments/{id} updates specific fields."""
    appointment = create_appointment()
    response = client.put(
        f"/appointments/{appointment['id']}",
        json={"appointment_type": "follow-up"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["appointment_type"] == "follow-up"
    assert isinstance(data["id"], int)


def test_delete_appointment_and_verify(
    client: TestClient, create_appointment
) -> None:
    """Verify DELETE /appointments/{id} removes the appointment."""
    appointment = create_appointment()
    del_resp = client.delete(f"/appointments/{appointment['id']}")
    assert del_resp.status_code == 204

    get_resp = client.get(f"/appointments/{appointment['id']}")
    assert get_resp.status_code == 404


# -------------------------------------------------------------------- #
#  Endpoint filtering tests                                             #
# -------------------------------------------------------------------- #


def test_filter_appointments_by_patient_id(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify GET /appointments/?patient_id=N filters correctly."""
    p1 = create_patient(first_name="Alice")
    p2 = create_patient(first_name="Bob")
    create_appointment(
        patient_id=p1["id"], date_time="2025-12-15T10:00:00"
    )
    create_appointment(
        patient_id=p2["id"], date_time="2025-12-16T10:00:00"
    )

    response = client.get(f"/appointments/?patient_id={p1['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["patient_id"] == p1["id"]


def test_filter_appointments_by_date_range(
    client: TestClient, create_appointment
) -> None:
    """Verify date_from and date_to query params filter by date range."""
    create_appointment(date_time="2025-12-10T10:00:00")
    create_appointment(date_time="2025-12-20T10:00:00")

    response = client.get(
        "/appointments/"
        "?date_from=2025-12-15T00:00:00&date_to=2025-12-25T00:00:00"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_filter_appointments_by_status(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify status query param filters appointments."""
    patient = create_patient()
    appt = create_appointment(
        patient_id=patient["id"], date_time="2025-12-15T10:00:00"
    )
    client.put(
        f"/appointments/{appt['id']}", json={"status": "completed"}
    )
    create_appointment(
        patient_id=patient["id"], date_time="2025-12-16T10:00:00"
    )

    response = client.get("/appointments/?status=completed")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "completed"


# -------------------------------------------------------------------- #
#  Appointment status validation tests                                  #
# -------------------------------------------------------------------- #


def test_appointment_default_status_is_scheduled(
    client: TestClient, create_appointment
) -> None:
    """Verify default appointment status is 'scheduled'."""
    appointment = create_appointment()
    assert appointment["status"] == "scheduled"


def test_appointment_status_transitions(
    client: TestClient, create_appointment
) -> None:
    """Verify appointment status can transition through valid values."""
    appointment = create_appointment()
    appt_id = appointment["id"]

    resp = client.put(
        f"/appointments/{appt_id}", json={"status": "completed"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "completed"

    resp = client.put(
        f"/appointments/{appt_id}", json={"status": "cancelled"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"


def test_invalid_status_value_returns_422(
    client: TestClient, create_appointment
) -> None:
    """Verify updating to an invalid status returns 422."""
    appointment = create_appointment()
    resp = client.put(
        f"/appointments/{appointment['id']}",
        json={"status": "invalid_status"},
    )
    assert resp.status_code == 422


def test_appointment_status_enum_values() -> None:
    """Verify AppointmentStatus enum contains expected values."""
    assert AppointmentStatus.scheduled.value == "scheduled"
    assert AppointmentStatus.completed.value == "completed"
    assert AppointmentStatus.cancelled.value == "cancelled"


# -------------------------------------------------------------------- #
#  Scheduling conflict detection tests                                  #
# -------------------------------------------------------------------- #


def test_scheduling_conflict_returns_409(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify creating appointment with time conflict returns 409."""
    patient = create_patient()
    patient_id = patient["id"]
    create_appointment(
        patient_id=patient_id, date_time="2025-12-15T10:00:00"
    )

    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient_id,
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "follow-up",
        },
    )
    assert response.status_code == 409


def test_overlapping_partial_conflict_returns_409(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify partially overlapping appointments are detected."""
    patient = create_patient()
    create_appointment(
        patient_id=patient["id"],
        date_time="2025-12-15T10:00:00",
        duration_minutes=60,
    )

    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient["id"],
            "date_time": "2025-12-15T10:30:00",
            "appointment_type": "follow-up",
        },
    )
    assert response.status_code == 409


def test_no_conflict_after_existing_appointment_ends(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify appointment immediately after another does not conflict."""
    patient = create_patient()
    create_appointment(
        patient_id=patient["id"],
        date_time="2025-12-15T10:00:00",
        duration_minutes=30,
    )

    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient["id"],
            "date_time": "2025-12-15T10:30:00",
            "appointment_type": "follow-up",
        },
    )
    assert response.status_code == 201


def test_cancelled_appointment_does_not_conflict(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify cancelled appointments are excluded from conflict check."""
    patient = create_patient()
    appt = create_appointment(
        patient_id=patient["id"], date_time="2025-12-15T10:00:00"
    )
    client.put(
        f"/appointments/{appt['id']}", json={"status": "cancelled"}
    )

    response = client.post(
        "/appointments/",
        json={
            "patient_id": patient["id"],
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "follow-up",
        },
    )
    assert response.status_code == 201


def test_different_patients_do_not_conflict(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify same-time appointments for different patients succeed."""
    p1 = create_patient(first_name="Alice")
    p2 = create_patient(first_name="Bob")
    create_appointment(
        patient_id=p1["id"], date_time="2025-12-15T10:00:00"
    )

    response = client.post(
        "/appointments/",
        json={
            "patient_id": p2["id"],
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "checkup",
        },
    )
    assert response.status_code == 201


def test_validate_scheduling_conflict_service_method() -> None:
    """Verify the validate_scheduling_conflict service method exists
    and is callable."""
    from datetime import datetime

    assert callable(appointment_service.validate_scheduling_conflict)
    # With no appointments in storage, should return False
    result = appointment_service.validate_scheduling_conflict(
        patient_id=1,
        date_time=datetime(2025, 12, 15, 10, 0),
        duration_minutes=30,
    )
    assert result is False


# -------------------------------------------------------------------- #
#  Foreign key validation tests                                         #
# -------------------------------------------------------------------- #


def test_nonexistent_patient_returns_404(client: TestClient) -> None:
    """Verify appointment creation with non-existent patient_id returns
    404 Not Found as specified in contract."""
    response = client.post(
        "/appointments/",
        json={
            "patient_id": 99999,
            "date_time": "2025-12-15T10:00:00",
            "appointment_type": "checkup",
        },
    )
    assert response.status_code == 404, (
        "Expected 404 Not Found for non-existent patient_id, "
        f"got {response.status_code}"
    )


def test_invalid_appointment_data_returns_422(client: TestClient) -> None:
    """Verify appointment creation with invalid datetime format returns
    exactly HTTP 422 status code as specified in contract."""
    response = client.post(
        "/appointments/",
        json={
            "patient_id": 1,
            "date_time": "not-a-valid-datetime",
            "appointment_type": "checkup",
        },
    )
    assert response.status_code == 422


def test_update_with_nonexistent_patient_returns_404(
    client: TestClient, create_appointment
) -> None:
    """Verify updating appointment with non-existent patient_id returns 404."""
    appointment = create_appointment()
    response = client.put(
        f"/appointments/{appointment['id']}",
        json={"patient_id": 99999},
    )
    assert response.status_code == 404


def test_service_validates_integer_patient_id_foreign_key() -> None:
    """Verify appointment service validates that patient_id references
    an existing patient record and rejects invalid integers."""
    invalid_patient_id = 99999
    result = appointment_service.patient_exists(invalid_patient_id)
    assert result is False

    appointment_data = AppointmentCreate(
        patient_id=invalid_patient_id,
        date_time="2025-12-15T10:00:00",
        appointment_type="checkup",
    )
    assert isinstance(appointment_data.patient_id, int)


def test_validate_patient_exists_service_method() -> None:
    """Verify the validate_patient_exists service method exists and works."""
    assert callable(appointment_service.validate_patient_exists)
    result = appointment_service.validate_patient_exists(99999)
    assert result is False


# -------------------------------------------------------------------- #
#  JOIN query operation tests                                           #
# -------------------------------------------------------------------- #


def test_storage_join_returns_patient_data_with_appointments(
    client: TestClient,
    create_patient,
    create_appointment,
) -> None:
    """Verify storage layer JOIN operations return patient information
    alongside appointment data when queried."""
    patient = create_patient()
    patient_id = patient["id"]
    appointment = create_appointment(patient_id=patient_id)
    appointment_id = appointment["id"]

    result = appointment_service.get_appointment_with_patient(appointment_id)
    assert result is not None, "JOIN query should return a result"
    assert "patient_id" in result
    assert "first_name" in result or "patient" in result, (
        "Result should contain patient data from JOIN operation"
    )


def test_join_includes_correct_patient_name(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify JOIN result includes the correct patient name."""
    patient = create_patient(first_name="TestFirst", last_name="TestLast")
    appointment = create_appointment(patient_id=patient["id"])

    result = appointment_service.get_appointment_with_patient(
        appointment["id"]
    )
    assert result is not None
    patient_first = result.get("first_name") or result.get(
        "patient", {}
    ).get("first_name")
    assert patient_first == "TestFirst"


def test_join_via_endpoint(
    client: TestClient, create_patient, create_appointment
) -> None:
    """Verify the /with-patient endpoint returns joined data."""
    patient = create_patient(first_name="EndpointTest")
    appointment = create_appointment(patient_id=patient["id"])

    response = client.get(
        f"/appointments/{appointment['id']}/with-patient"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["patient_id"] == patient["id"]
    assert "first_name" in data or "patient" in data


def test_join_nonexistent_appointment_returns_404(
    client: TestClient,
) -> None:
    """Verify JOIN endpoint returns 404 for non-existent appointment."""
    response = client.get("/appointments/99999/with-patient")
    assert response.status_code == 404


def test_storage_join_uses_sql(
    create_patient, create_appointment, client: TestClient
) -> None:
    """Verify the SQL storage layer performs JOIN queries."""
    patient = create_patient()
    appointment = create_appointment(patient_id=patient["id"])

    storage = get_storage()
    result = storage.get_appointment_with_patient(appointment["id"])
    assert result is not None
    assert result["patient_id"] == patient["id"]
    assert "patient" in result
    assert result["patient"]["first_name"] == patient["first_name"]


# -------------------------------------------------------------------- #
#  404 tests for non-existent resources                                 #
# -------------------------------------------------------------------- #


def test_appointment_not_found_returns_404(client: TestClient) -> None:
    """Verify GET /appointments/{non_existent_id} returns 404."""
    response = client.get("/appointments/99999")
    assert response.status_code == 404


def test_delete_nonexistent_appointment_returns_404(
    client: TestClient,
) -> None:
    """Verify DELETE /appointments/{non_existent_id} returns 404."""
    response = client.delete("/appointments/99999")
    assert response.status_code == 404


def test_update_appointment_with_integer_patient_id(
    client: TestClient,
    create_patient,
    create_appointment,
) -> None:
    """Verify PUT /appointments/{id} endpoint accepts integer patient_id
    and updates appointment successfully."""
    patient = create_patient()
    appointment = create_appointment(patient_id=patient["id"])

    new_patient = create_patient(
        first_name="John",
        last_name="Smith",
        email="john.smith@example.com",
    )
    new_patient_id = new_patient["id"]

    response = client.put(
        f"/appointments/{appointment['id']}",
        json={"patient_id": new_patient_id},
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["patient_id"], int)
    assert data["patient_id"] == new_patient_id
