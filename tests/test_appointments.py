"""Integration tests for the appointments CRUD API endpoints.

Tests the full SQLite-backed appointment lifecycle: create, read, update,
and delete operations, including foreign key constraint enforcement
against the patients table.
"""

from fastapi.testclient import TestClient


def create_test_patient(client: TestClient) -> dict:
    """Helper that POSTs to /patients with test data and returns the patient dict."""
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "date_of_birth": "1990-01-15",
        "gender": "female",
        "phone_number": "555-123-4567",
        "email": "jane.doe@example.com",
        "address": "123 Main St, Springfield, IL 62701",
    }
    response = client.post("/patients/", json=payload)
    assert response.status_code == 201, (
        f"create_test_patient expected 201, got {response.status_code}"
    )
    return response.json()


# ---------------------------------------------------------------------------
# POST /appointments
# ---------------------------------------------------------------------------


def test_create_appointment_with_valid_patient_returns_201(
    client: TestClient,
) -> None:
    """POST /appointments with a valid patient_id returns 201 and a complete
    appointment response including id, patient_id, doctor_name, datetime,
    status, notes, created_at, and updated_at.
    """
    # Arrange
    patient = create_test_patient(client)
    payload = {
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
        "status": "scheduled",
        "notes": "Initial consultation",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    data = response.json()
    assert "id" in data, "Response must include an id field"
    assert data["patient_id"] == patient["id"], (
        "Response patient_id must match the submitted value"
    )
    assert data["doctor_name"] == "Dr. Smith", (
        "Response doctor_name must match the submitted value"
    )
    assert data["datetime"] == "2025-12-15T10:00:00", (
        "Response datetime must match the submitted value"
    )
    assert data["status"] == "scheduled", (
        "Response status must match the submitted value"
    )
    assert data["notes"] == "Initial consultation", (
        "Response notes must match the submitted value"
    )
    assert "created_at" in data, "Response must include a created_at field"
    assert "updated_at" in data, "Response must include an updated_at field"


def test_create_appointment_nonexistent_patient_returns_400(
    client: TestClient,
) -> None:
    """POST /appointments with a non-existent patient_id returns 400 with
    an error detail about patient not found.
    """
    # Arrange
    payload = {
        "patient_id": "nonexistent-patient-id",
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    }

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 400, (
        f"Expected 400 Bad Request for non-existent patient, got {response.status_code}"
    )
    data = response.json()
    assert "detail" in data, "Error response must include a detail field"
    assert "patient" in data["detail"].lower() or "not found" in data["detail"].lower(), (
        "Error detail must mention patient not found"
    )


def test_create_appointment_missing_required_fields_returns_422(
    client: TestClient,
) -> None:
    """POST /appointments with missing required fields returns 422
    Unprocessable Entity.
    """
    # Arrange -- send an empty body, missing patient_id, doctor_name, datetime
    payload: dict = {}

    # Act
    response = client.post("/appointments/", json=payload)

    # Assert
    assert response.status_code == 422, (
        f"Expected 422 for missing required fields, got {response.status_code}"
    )


# ---------------------------------------------------------------------------
# GET /appointments
# ---------------------------------------------------------------------------


def test_get_appointments_empty_returns_empty_list(
    client: TestClient,
) -> None:
    """GET /appointments returns 200 with an empty list when no appointments
    exist in the database.
    """
    # Arrange -- nothing; database is already clean from the fixture

    # Act
    response = client.get("/appointments/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert data == [], "Expected an empty list when no appointments exist"


def test_get_appointments_returns_all_appointments(
    client: TestClient,
) -> None:
    """GET /appointments returns 200 with a list of all appointments after
    creating 2 test appointments.
    """
    # Arrange
    patient = create_test_patient(client)
    appointment_payload_1 = {
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    }
    appointment_payload_2 = {
        "patient_id": patient["id"],
        "doctor_name": "Dr. Jones",
        "datetime": "2025-12-16T14:00:00",
        "notes": "Follow-up visit",
    }
    client.post("/appointments/", json=appointment_payload_1)
    client.post("/appointments/", json=appointment_payload_2)

    # Act
    response = client.get("/appointments/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert len(data) == 2, (
        f"Expected 2 appointments in the list, got {len(data)}"
    )


# ---------------------------------------------------------------------------
# GET /appointments/{appointment_id}
# ---------------------------------------------------------------------------


def test_get_appointment_by_id_returns_appointment(
    client: TestClient,
) -> None:
    """GET /appointments/{id} returns 200 with appointment details for an
    existing appointment.
    """
    # Arrange
    patient = create_test_patient(client)
    create_response = client.post("/appointments/", json={
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
        "notes": "Routine check",
    })
    created = create_response.json()
    appointment_id = created["id"]

    # Act
    response = client.get(f"/appointments/{appointment_id}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert data["id"] == appointment_id, "Returned appointment id must match"
    assert data["patient_id"] == patient["id"], (
        "Returned patient_id must match"
    )
    assert data["doctor_name"] == "Dr. Smith", (
        "Returned doctor_name must match"
    )
    assert data["datetime"] == "2025-12-15T10:00:00", (
        "Returned datetime must match"
    )
    assert data["notes"] == "Routine check", "Returned notes must match"


def test_get_appointment_nonexistent_returns_404(
    client: TestClient,
) -> None:
    """GET /appointments/{id} returns 404 for a non-existent appointment ID."""
    # Arrange
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.get(f"/appointments/{nonexistent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    data = response.json()
    assert "detail" in data, "Error response must include a detail field"


# ---------------------------------------------------------------------------
# PUT /appointments/{appointment_id}
# ---------------------------------------------------------------------------


def test_update_appointment_returns_updated_data(
    client: TestClient,
) -> None:
    """PUT /appointments/{id} updates appointment fields and the updated_at
    timestamp, returning the updated appointment data.
    """
    # Arrange
    patient = create_test_patient(client)
    create_response = client.post("/appointments/", json={
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    })
    created = create_response.json()
    appointment_id = created["id"]
    original_updated_at = created["updated_at"]

    update_payload = {"doctor_name": "Dr. Johnson"}

    # Act
    response = client.put(f"/appointments/{appointment_id}", json=update_payload)

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert data["doctor_name"] == "Dr. Johnson", (
        "doctor_name must be updated to the new value"
    )
    assert data["patient_id"] == patient["id"], (
        "patient_id must remain unchanged"
    )
    assert data["updated_at"] != original_updated_at, (
        "updated_at must change after an update"
    )


def test_update_appointment_invalid_patient_id_returns_400(
    client: TestClient,
) -> None:
    """PUT /appointments/{id} with an invalid patient_id returns 400 due to
    the foreign key constraint.
    """
    # Arrange
    patient = create_test_patient(client)
    create_response = client.post("/appointments/", json={
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    })
    created = create_response.json()
    appointment_id = created["id"]

    update_payload = {"patient_id": "nonexistent-patient-id"}

    # Act
    response = client.put(f"/appointments/{appointment_id}", json=update_payload)

    # Assert
    assert response.status_code == 400, (
        f"Expected 400 Bad Request for invalid patient_id FK, got {response.status_code}"
    )
    data = response.json()
    assert "detail" in data, "Error response must include a detail field"
    assert "patient" in data["detail"].lower() or "not found" in data["detail"].lower(), (
        "Error detail must mention patient not found"
    )


def test_update_appointment_nonexistent_returns_404(
    client: TestClient,
) -> None:
    """PUT /appointments/{id} returns 404 for a non-existent appointment ID."""
    # Arrange
    nonexistent_id = "00000000-0000-0000-0000-000000000000"
    update_payload = {"doctor_name": "Dr. Johnson"}

    # Act
    response = client.put(f"/appointments/{nonexistent_id}", json=update_payload)

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )


# ---------------------------------------------------------------------------
# DELETE /appointments/{appointment_id}
# ---------------------------------------------------------------------------


def test_delete_appointment_removes_appointment(
    client: TestClient,
) -> None:
    """DELETE /appointments/{id} removes the appointment. A subsequent GET
    for the same id returns 404.
    """
    # Arrange
    patient = create_test_patient(client)
    create_response = client.post("/appointments/", json={
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    })
    created = create_response.json()
    appointment_id = created["id"]

    # Act
    delete_response = client.delete(f"/appointments/{appointment_id}")

    # Assert
    assert delete_response.status_code == 200, (
        f"Expected 200 OK for successful delete, got {delete_response.status_code}"
    )
    delete_data = delete_response.json()
    assert delete_data.get("message") == "Appointment deleted", (
        "Delete response must contain the confirmation message"
    )

    # Verify the appointment is actually gone
    get_response = client.get(f"/appointments/{appointment_id}")
    assert get_response.status_code == 404, (
        "GET after DELETE must return 404"
    )


def test_delete_appointment_nonexistent_returns_404(
    client: TestClient,
) -> None:
    """DELETE /appointments/{id} returns 404 for a non-existent appointment ID."""
    # Arrange
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.delete(f"/appointments/{nonexistent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )


# ---------------------------------------------------------------------------
# Foreign key cascade / constraint edge case
# ---------------------------------------------------------------------------


def test_delete_patient_with_appointments_fails(
    client: TestClient,
) -> None:
    """Deleting a patient who has appointments should fail because of the
    foreign key constraint in SQLite (appointments.patient_id references
    patients.id).
    """
    # Arrange
    patient = create_test_patient(client)
    client.post("/appointments/", json={
        "patient_id": patient["id"],
        "doctor_name": "Dr. Smith",
        "datetime": "2025-12-15T10:00:00",
    })

    # Act
    response = client.delete(f"/patients/{patient['id']}")

    # Assert -- the delete should be rejected due to FK constraint
    assert response.status_code != 204, (
        "Deleting a patient with existing appointments must not succeed with 204"
    )
    assert response.status_code != 200, (
        "Deleting a patient with existing appointments must not succeed with 200"
    )
