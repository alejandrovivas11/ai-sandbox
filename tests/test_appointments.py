"""Comprehensive tests for the /appointments/ endpoints.

Covers CRUD operations, patient validation, default values, filtering
by patient_id, and error cases. These tests target endpoints that do
not yet exist (RED phase of TDD).
"""

from fastapi.testclient import TestClient


# ---------- POST /appointments/ ----------


def test_create_appointment_valid_data(
    client: TestClient, create_patient
) -> None:
    """POST /appointments/ with valid data returns 201 with id, patient_id,
    and status='scheduled'."""
    # Arrange
    patient = create_patient()
    payload = {
        "patient_id": patient["id"],
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    body = response.json()
    assert "id" in body, "Response must contain an 'id' field"
    assert body["patient_id"] == patient["id"], (
        "patient_id should match the created patient"
    )
    assert body["status"] == "scheduled", (
        f"Expected status='scheduled', got '{body.get('status')}'"
    )


def test_create_appointment_nonexistent_patient(client: TestClient) -> None:
    """POST /appointments/ with nonexistent patient_id returns 404 with
    detail containing the patient id."""
    # Arrange
    fake_patient_id = "00000000-0000-0000-0000-000000000000"
    payload = {
        "patient_id": fake_patient_id,
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"
    assert fake_patient_id in body["detail"], (
        "Detail message should contain the nonexistent patient id"
    )


def test_create_appointment_invalid_status(
    client: TestClient, create_patient
) -> None:
    """POST /appointments/ with invalid status returns 422 validation error."""
    # Arrange
    patient = create_patient()
    payload = {
        "patient_id": patient["id"],
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
        "status": "invalid_status_value",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 422, (
        f"Expected 422 Unprocessable Entity, got {response.status_code}"
    )


def test_create_appointment_default_status(
    client: TestClient, create_patient
) -> None:
    """POST /appointments/ without status field defaults to 'scheduled'."""
    # Arrange
    patient = create_patient()
    payload = {
        "patient_id": patient["id"],
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    body = response.json()
    assert body["status"] == "scheduled", (
        f"Expected default status='scheduled', got '{body.get('status')}'"
    )


def test_create_appointment_default_duration(
    client: TestClient, create_patient
) -> None:
    """POST /appointments/ without duration_minutes defaults to 30."""
    # Arrange
    patient = create_patient()
    payload = {
        "patient_id": patient["id"],
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    body = response.json()
    assert body["duration_minutes"] == 30, (
        f"Expected default duration_minutes=30, got {body.get('duration_minutes')}"
    )


# ---------- GET /appointments/ ----------


def test_get_appointments_empty(client: TestClient) -> None:
    """GET /appointments/ on empty storage returns 200 with empty list."""
    # Arrange -- storage is already empty via autouse fixture

    # Act
    response = client.get("/appointments/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    assert response.json() == [], (
        "Expected empty list when no appointments exist"
    )


def test_get_all_appointments(
    client: TestClient, create_appointment
) -> None:
    """GET /appointments/ after creating 3 appointments returns 200 with
    list of length 3."""
    # Arrange
    create_appointment()
    create_appointment()
    create_appointment()

    # Act
    response = client.get("/appointments/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    appointments = response.json()
    assert len(appointments) == 3, (
        f"Expected 3 appointments, got {len(appointments)}"
    )


def test_get_appointments_filter_by_patient(
    client: TestClient, create_patient
) -> None:
    """GET /appointments/?patient_id={id} filters correctly and returns
    appointments only for the specified patient."""
    # Arrange -- create 2 patients, each with appointments
    patient1 = create_patient(first_name="Alice")
    patient2 = create_patient(first_name="Bob")

    # Create 2 appointments for patient1
    client.post("/appointments/", json={
        "patient_id": patient1["id"],
        "date_time": "2025-12-15T10:00:00",
        "appointment_type": "checkup",
    })
    client.post("/appointments/", json={
        "patient_id": patient1["id"],
        "date_time": "2025-12-16T10:00:00",
        "appointment_type": "followup",
    })

    # Create 1 appointment for patient2
    client.post("/appointments/", json={
        "patient_id": patient2["id"],
        "date_time": "2025-12-17T10:00:00",
        "appointment_type": "checkup",
    })

    # Act
    response = client.get(f"/appointments/?patient_id={patient1['id']}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    appointments = response.json()
    assert len(appointments) == 2, (
        f"Expected 2 appointments for patient1, got {len(appointments)}"
    )
    for appt in appointments:
        assert appt["patient_id"] == patient1["id"], (
            "All returned appointments should belong to patient1"
        )


# ---------- GET /appointments/{id} ----------


def test_get_appointment_by_id(
    client: TestClient, create_appointment
) -> None:
    """GET /appointments/{id} returns 200 with appointment data matching
    the created appointment fields."""
    # Arrange
    created = create_appointment()
    appointment_id = created["id"]

    # Act
    response = client.get(f"/appointments/{appointment_id}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["id"] == appointment_id, (
        "Returned appointment id must match requested id"
    )
    assert body["patient_id"] == created["patient_id"], (
        "patient_id must match created appointment"
    )
    assert body["status"] == created["status"], (
        "status must match created appointment"
    )


def test_get_appointment_not_found(client: TestClient) -> None:
    """GET /appointments/{nonexistent-uuid} returns 404 error."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.get(f"/appointments/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"


# ---------- PUT /appointments/{id} ----------


def test_update_appointment_status(
    client: TestClient, create_appointment
) -> None:
    """PUT /appointments/{id} changing status to 'completed' updates status
    and changes the updated_at timestamp."""
    # Arrange
    created = create_appointment()
    appointment_id = created["id"]
    original_updated_at = created.get("updated_at")

    update_payload = {"status": "completed"}

    # Act
    response = client.put(f"/appointments/{appointment_id}", json=update_payload)

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["status"] == "completed", (
        f"Expected status='completed', got '{body.get('status')}'"
    )
    assert body["updated_at"] != original_updated_at, (
        "updated_at timestamp should change after status update"
    )


def test_update_appointment_invalid_patient(
    client: TestClient, create_appointment
) -> None:
    """PUT /appointments/{id} with nonexistent patient_id returns 404 error."""
    # Arrange
    created = create_appointment()
    appointment_id = created["id"]
    fake_patient_id = "00000000-0000-0000-0000-000000000000"

    update_payload = {"patient_id": fake_patient_id}

    # Act
    response = client.put(f"/appointments/{appointment_id}", json=update_payload)

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )


def test_update_appointment_not_found(client: TestClient) -> None:
    """PUT /appointments/{nonexistent-uuid} returns 404 error."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"
    update_payload = {"status": "completed"}

    # Act
    response = client.put(f"/appointments/{non_existent_id}", json=update_payload)

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"


# ---------- DELETE /appointments/{id} ----------


def test_delete_appointment(
    client: TestClient, create_appointment
) -> None:
    """DELETE /appointments/{id} removes appointment and subsequent GET
    returns 404."""
    # Arrange
    created = create_appointment()
    appointment_id = created["id"]

    # Act
    delete_response = client.delete(f"/appointments/{appointment_id}")

    # Assert
    assert delete_response.status_code == 204, (
        f"Expected 204 No Content, got {delete_response.status_code}"
    )
    get_response = client.get(f"/appointments/{appointment_id}")
    assert get_response.status_code == 404, (
        "Appointment should return 404 after deletion"
    )


def test_delete_appointment_not_found(client: TestClient) -> None:
    """DELETE /appointments/{nonexistent-uuid} returns 404 error."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.delete(f"/appointments/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"
