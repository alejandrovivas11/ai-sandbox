"""Comprehensive tests for the /patients/ endpoints.

Covers CRUD operations, validation errors (422), not-found errors (404),
edge cases, and unique ID generation.
"""

from fastapi.testclient import TestClient


# ---------- POST /patients/ ----------


def test_create_patient_valid_data(client: TestClient, sample_patient_data) -> None:
    """POST /patients/ with valid patient data returns 201 with id,
    created_at, updated_at and all field values echoed back."""
    # Arrange
    payload = sample_patient_data()

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


def test_create_patient_missing_required_field(client: TestClient) -> None:
    """POST /patients/ without required first_name field returns 422
    validation error."""
    # Arrange -- payload missing 'first_name'
    payload = {
        "last_name": "Doe",
        "date_of_birth": "1990-01-15",
        "gender": "female",
        "phone_number": "555-123-4567",
    }

    # Act
    response = client.post("/patients/", json=payload)

    # Assert
    assert response.status_code == 422, (
        f"Expected 422 Unprocessable Entity, got {response.status_code}"
    )


def test_create_patient_minimal_fields(client: TestClient) -> None:
    """POST /patients/ with only required fields returns 201 with
    email=None and address=None."""
    # Arrange -- only required fields, no email or address
    payload = {
        "first_name": "Min",
        "last_name": "Fields",
        "date_of_birth": "2000-06-01",
        "gender": "other",
        "phone_number": "555-000-0000",
    }

    # Act
    response = client.post("/patients/", json=payload)

    # Assert
    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}"
    )
    body = response.json()
    assert body["email"] is None, (
        "email should be None when not provided"
    )
    assert body["address"] is None, (
        "address should be None when not provided"
    )


# ---------- GET /patients/ ----------


def test_get_patients_empty(client: TestClient) -> None:
    """GET /patients/ on empty storage returns 200 with empty list."""
    # Arrange -- storage is already empty via autouse fixture

    # Act
    response = client.get("/patients/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    assert response.json() == [], "Expected empty list when no patients exist"


def test_get_patients_returns_created(
    client: TestClient, create_patient
) -> None:
    """GET /patients/ after creating 2 patients returns 200 with list of
    length 2."""
    # Arrange
    create_patient(first_name="Alice")
    create_patient(first_name="Bob")

    # Act
    response = client.get("/patients/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    patients = response.json()
    assert len(patients) == 2, (
        f"Expected 2 patients in the list, got {len(patients)}"
    )


# ---------- GET /patients/{id} ----------


def test_get_patient_by_id(client: TestClient, create_patient) -> None:
    """GET /patients/{id} returns 200 with patient data matching all
    fields of the created patient."""
    # Arrange
    created = create_patient()
    patient_id = created["id"]

    # Act
    response = client.get(f"/patients/{patient_id}")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["id"] == patient_id, "Returned patient id must match requested id"
    assert body["first_name"] == created["first_name"], (
        "first_name must match created patient"
    )
    assert body["last_name"] == created["last_name"], (
        "last_name must match created patient"
    )
    assert body["date_of_birth"] == created["date_of_birth"], (
        "date_of_birth must match created patient"
    )
    assert body["gender"] == created["gender"], (
        "gender must match created patient"
    )
    assert body["phone_number"] == created["phone_number"], (
        "phone_number must match created patient"
    )


def test_get_patient_not_found(client: TestClient) -> None:
    """GET /patients/{nonexistent-uuid} returns 404 with detail message."""
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


def test_update_patient_partial(client: TestClient, create_patient) -> None:
    """PUT /patients/{id} with only first_name keeps last_name unchanged
    and updates the updated_at timestamp."""
    # Arrange
    created = create_patient()
    patient_id = created["id"]
    original_last_name = created["last_name"]
    original_updated_at = created["updated_at"]

    update_payload = {"first_name": "UpdatedName"}

    # Act
    response = client.put(f"/patients/{patient_id}", json=update_payload)

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body["first_name"] == "UpdatedName", (
        "first_name should be updated to the new value"
    )
    assert body["last_name"] == original_last_name, (
        "last_name should be unchanged after partial update"
    )
    assert body["updated_at"] != original_updated_at, (
        "updated_at timestamp should change after update"
    )


def test_update_patient_not_found(client: TestClient) -> None:
    """PUT /patients/{nonexistent-uuid} returns 404 error."""
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


def test_delete_patient(client: TestClient, create_patient) -> None:
    """DELETE /patients/{id} removes patient and subsequent GET returns 404."""
    # Arrange
    created = create_patient()
    patient_id = created["id"]

    # Act
    delete_response = client.delete(f"/patients/{patient_id}")

    # Assert
    assert delete_response.status_code == 204, (
        f"Expected 204 No Content, got {delete_response.status_code}"
    )
    get_response = client.get(f"/patients/{patient_id}")
    assert get_response.status_code == 404, (
        "Patient should return 404 after deletion"
    )


def test_delete_patient_not_found(client: TestClient) -> None:
    """DELETE /patients/{nonexistent-uuid} returns 404 error."""
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


# ---------- Unique IDs ----------


def test_create_multiple_patients_unique_ids(
    client: TestClient, create_patient
) -> None:
    """Creating 3 patients generates 3 different unique IDs."""
    # Arrange / Act
    patient1 = create_patient(first_name="Alice")
    patient2 = create_patient(first_name="Bob")
    patient3 = create_patient(first_name="Charlie")

    # Assert
    ids = {patient1["id"], patient2["id"], patient3["id"]}
    assert len(ids) == 3, (
        f"Expected 3 unique patient IDs, got {len(ids)} unique values"
    )
