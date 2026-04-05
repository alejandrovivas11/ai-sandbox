from fastapi.testclient import TestClient

from app import storage


def valid_patient_data() -> dict:
    """Return a valid patient payload for use across tests."""
    return {
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-01-15",
        "gender": "female",
        "phone_number": "555-123-4567",
        "email": "jane.doe@example.com",
        "address": "123 Main St, Springfield, IL 62701",
    }


# ---------- POST /patients/ ----------


def test_create_patient(client: TestClient) -> None:
    """POST /patients/ with valid data returns 201 with id, timestamps, and echoed fields."""
    # Arrange
    payload = valid_patient_data()

    # Act
    response = client.post("/patients/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    body = response.json()
    assert "id" in body, "Response must contain an 'id' field"
    assert "created_at" in body, "Response must contain a 'created_at' field"
    assert "updated_at" in body, "Response must contain an 'updated_at' field"
    assert body["first_name"] == payload["first_name"], (
        "first_name should be echoed back"
    )
    assert body["last_name"] == payload["last_name"], (
        "last_name should be echoed back"
    )
    assert body["date_of_birth"] == payload["date_of_birth"], (
        "date_of_birth should be echoed back"
    )
    assert body["gender"] == payload["gender"], "gender should be echoed back"
    assert body["phone_number"] == payload["phone_number"], (
        "phone_number should be echoed back"
    )
    assert body["email"] == payload["email"], "email should be echoed back"
    assert body["address"] == payload["address"], "address should be echoed back"


# ---------- GET /patients/ ----------


def test_get_patients_empty_list(client: TestClient) -> None:
    """GET /patients/ returns 200 with an empty list when no patients exist."""
    # Arrange — storage is already empty via autouse fixture

    # Act
    response = client.get("/patients/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    assert response.json() == [], "Expected empty list when no patients exist"


def test_get_patients_populated_list(client: TestClient) -> None:
    """GET /patients/ returns 200 with populated list after creating a patient."""
    # Arrange
    payload = valid_patient_data()
    client.post("/patients/", json=payload)

    # Act
    response = client.get("/patients/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    patients = response.json()
    assert len(patients) == 1, "Expected exactly one patient in the list"
    assert patients[0]["first_name"] == payload["first_name"], (
        "Patient first_name should match created patient"
    )


# ---------- GET /patients/{id} ----------


def test_get_patient_by_id_exists(client: TestClient) -> None:
    """GET /patients/{id} returns 200 with correct data for an existing patient."""
    # Arrange
    payload = valid_patient_data()
    create_response = client.post("/patients/", json=payload)
    patient_id = create_response.json()["id"]

    # Act
    response = client.get(f"/patients/{patient_id}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["id"] == patient_id, "Returned patient id must match requested id"
    assert body["first_name"] == payload["first_name"], (
        "first_name must match created patient"
    )
    assert body["last_name"] == payload["last_name"], (
        "last_name must match created patient"
    )


def test_get_patient_by_id_not_found(client: TestClient) -> None:
    """GET /patients/{id} returns 404 with detail message for non-existent id."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.get(f"/patients/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"


# ---------- PUT /patients/{id} ----------


def test_update_patient_partial_fields(client: TestClient) -> None:
    """PUT /patients/{id} partially updates only provided fields, returns 200."""
    # Arrange
    payload = valid_patient_data()
    create_response = client.post("/patients/", json=payload)
    created = create_response.json()
    patient_id = created["id"]
    original_updated_at = created["updated_at"]

    update_payload = {"first_name": "Janet"}

    # Act
    response = client.put(f"/patients/{patient_id}", json=update_payload)

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["first_name"] == "Janet", (
        "first_name should be updated to the new value"
    )
    assert body["last_name"] == payload["last_name"], (
        "last_name should be unchanged after partial update"
    )
    assert body["phone_number"] == payload["phone_number"], (
        "phone_number should be unchanged after partial update"
    )
    assert body["updated_at"] != original_updated_at, (
        "updated_at timestamp should change after update"
    )


def test_update_patient_not_found(client: TestClient) -> None:
    """PUT /patients/{id} returns 404 when the patient does not exist."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"
    update_payload = {"first_name": "Ghost"}

    # Act
    response = client.put(f"/patients/{non_existent_id}", json=update_payload)

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"


# ---------- DELETE /patients/{id} ----------


def test_delete_patient_exists(client: TestClient) -> None:
    """DELETE /patients/{id} returns 204 and the patient is removed from storage."""
    # Arrange
    payload = valid_patient_data()
    create_response = client.post("/patients/", json=payload)
    patient_id = create_response.json()["id"]

    # Act
    delete_response = client.delete(f"/patients/{patient_id}")

    # Assert
    assert delete_response.status_code == 204, (
        f"Expected 204 No Content, got {delete_response.status_code}"
    )

    # Verify the patient is actually gone
    get_response = client.get(f"/patients/{patient_id}")
    assert get_response.status_code == 404, (
        "Patient should return 404 after deletion"
    )


def test_delete_patient_not_found(client: TestClient) -> None:
    """DELETE /patients/{id} returns 404 when the patient does not exist."""
    # Arrange
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    # Act
    response = client.delete(f"/patients/{non_existent_id}")

    # Assert
    assert response.status_code == 404, (
        f"Expected 404 Not Found, got {response.status_code}"
    )
    body = response.json()
    assert "detail" in body, "404 response must include a 'detail' field"


# ---------- Storage isolation ----------


def test_storage_reset_isolates_tests(client: TestClient) -> None:
    """Verify that storage.reset() properly clears all patient data."""
    # Arrange -- create a patient so the db is non-empty
    payload = valid_patient_data()
    client.post("/patients/", json=payload)

    # Act
    storage.reset()

    # Assert -- the db should now be empty
    assert storage.patients_db == {}, (
        "patients_db should be empty after reset()"
    )
    response = client.get("/patients/")
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    assert response.json() == [], (
        "GET /patients/ should return empty list after storage reset"
    )
