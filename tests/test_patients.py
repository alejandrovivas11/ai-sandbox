"""Integration tests for the Patient CRUD endpoints.

Each test exercises the full HTTP stack via TestClient, verifying that the
FastAPI routes, service layer, and SQLite storage work together correctly.
"""

import time

from fastapi.testclient import TestClient


class TestCreatePatient:
    """Tests for POST /patients."""

    def test_create_patient_returns_201_with_all_fields(
        self, client: TestClient, sample_patient_data: dict
    ) -> None:
        """Verify POST /patients with valid data returns 201 with id, name,
        email, phone, date_of_birth, created_at, and updated_at."""
        # Arrange
        payload = sample_patient_data

        # Act
        response = client.post("/patients/", json=payload)

        # Assert
        assert response.status_code == 201, (
            f"Expected 201 Created, got {response.status_code}"
        )
        body = response.json()
        assert "id" in body, "Response must include 'id'"
        assert body["name"] == payload["name"], (
            f"Expected name '{payload['name']}', got '{body.get('name')}'"
        )
        assert body["email"] == payload["email"], (
            f"Expected email '{payload['email']}', got '{body.get('email')}'"
        )
        assert body["phone"] == payload["phone"], (
            f"Expected phone '{payload['phone']}', got '{body.get('phone')}'"
        )
        assert body["date_of_birth"] == payload["date_of_birth"], (
            f"Expected date_of_birth '{payload['date_of_birth']}', "
            f"got '{body.get('date_of_birth')}'"
        )
        assert "created_at" in body, "Response must include 'created_at'"
        assert "updated_at" in body, "Response must include 'updated_at'"

    def test_create_patient_without_optional_fields(
        self, client: TestClient
    ) -> None:
        """Verify POST /patients with only name and email returns 201
        and phone/date_of_birth are None."""
        # Arrange
        payload = {"name": "John Smith", "email": "john@example.com"}

        # Act
        response = client.post("/patients/", json=payload)

        # Assert
        assert response.status_code == 201, (
            f"Expected 201 Created, got {response.status_code}"
        )
        body = response.json()
        assert body["name"] == "John Smith"
        assert body["email"] == "john@example.com"
        assert body["phone"] is None, (
            f"Expected phone to be None, got '{body.get('phone')}'"
        )
        assert body["date_of_birth"] is None, (
            f"Expected date_of_birth to be None, got '{body.get('date_of_birth')}'"
        )

    def test_create_patient_missing_required_field_returns_422(
        self, client: TestClient
    ) -> None:
        """Verify POST /patients without required 'name' field returns
        422 validation error."""
        # Arrange -- payload missing 'name'
        payload = {"email": "noname@example.com"}

        # Act
        response = client.post("/patients/", json=payload)

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 Unprocessable Entity, got {response.status_code}"
        )


class TestGetPatients:
    """Tests for GET /patients."""

    def test_list_patients_empty(self, client: TestClient) -> None:
        """Verify GET /patients returns 200 with an empty list when no
        patients exist."""
        # Arrange -- clean state from fixture

        # Act
        response = client.get("/patients/")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        assert response.json() == [], (
            f"Expected empty list, got {response.json()}"
        )

    def test_get_patients_returns_all_patients(
        self, client: TestClient, sample_patient_data: dict
    ) -> None:
        """Verify GET /patients returns 200 with a list containing all
        created patients."""
        # Arrange -- create two patients
        patient_a = {**sample_patient_data, "name": "Alice", "email": "alice@example.com"}
        patient_b = {**sample_patient_data, "name": "Bob", "email": "bob@example.com"}
        client.post("/patients/", json=patient_a)
        client.post("/patients/", json=patient_b)

        # Act
        response = client.get("/patients/")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        patients = response.json()
        assert len(patients) == 2, (
            f"Expected 2 patients, got {len(patients)}"
        )
        names = {p["name"] for p in patients}
        assert "Alice" in names, "Expected 'Alice' in patient list"
        assert "Bob" in names, "Expected 'Bob' in patient list"


class TestGetPatientById:
    """Tests for GET /patients/{patient_id}."""

    def test_get_patient_by_id_returns_200_with_data(
        self, client: TestClient, sample_patient_data: dict
    ) -> None:
        """Verify GET /patients/{id} returns 200 with correct patient data
        for an existing patient."""
        # Arrange
        create_resp = client.post("/patients/", json=sample_patient_data)
        patient_id = create_resp.json()["id"]

        # Act
        response = client.get(f"/patients/{patient_id}")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        body = response.json()
        assert body["id"] == patient_id, (
            f"Expected id '{patient_id}', got '{body.get('id')}'"
        )
        assert body["name"] == sample_patient_data["name"], (
            f"Expected name '{sample_patient_data['name']}', got '{body.get('name')}'"
        )

    def test_get_patient_nonexistent_returns_404(
        self, client: TestClient
    ) -> None:
        """Verify GET /patients/{invalid_id} returns 404 with
        'Patient not found' detail message."""
        # Arrange
        fake_id = "00000000-0000-0000-0000-000000000000"

        # Act
        response = client.get(f"/patients/{fake_id}")

        # Assert
        assert response.status_code == 404, (
            f"Expected 404 Not Found, got {response.status_code}"
        )
        assert response.json()["detail"] == "Patient not found", (
            f"Expected detail 'Patient not found', got '{response.json().get('detail')}'"
        )


class TestUpdatePatient:
    """Tests for PUT /patients/{patient_id}."""

    def test_update_patient_partial_fields_updates_timestamp(
        self, client: TestClient, sample_patient_data: dict
    ) -> None:
        """Verify PUT /patients/{id} with partial data updates only the
        provided fields and refreshes the updated_at timestamp."""
        # Arrange
        create_resp = client.post("/patients/", json=sample_patient_data)
        created = create_resp.json()
        patient_id = created["id"]
        original_updated_at = created["updated_at"]

        # Small delay to ensure timestamp differs
        time.sleep(0.05)

        # Act -- update only the phone field
        update_payload = {"phone": "555-999-0000"}
        response = client.put(f"/patients/{patient_id}", json=update_payload)

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        body = response.json()
        assert body["phone"] == "555-999-0000", (
            f"Expected phone '555-999-0000', got '{body.get('phone')}'"
        )
        assert body["name"] == sample_patient_data["name"], (
            "Name should remain unchanged after partial update"
        )
        assert body["email"] == sample_patient_data["email"], (
            "Email should remain unchanged after partial update"
        )
        assert body["updated_at"] != original_updated_at, (
            "updated_at should change after an update"
        )

    def test_update_patient_nonexistent_returns_404(
        self, client: TestClient
    ) -> None:
        """Verify PUT /patients/{invalid_id} returns 404 for a
        non-existent patient."""
        # Arrange
        fake_id = "00000000-0000-0000-0000-000000000000"
        payload = {"name": "Ghost"}

        # Act
        response = client.put(f"/patients/{fake_id}", json=payload)

        # Assert
        assert response.status_code == 404, (
            f"Expected 404 Not Found, got {response.status_code}"
        )


class TestDeletePatient:
    """Tests for DELETE /patients/{patient_id}."""

    def test_delete_patient_removes_and_returns_success(
        self, client: TestClient, sample_patient_data: dict
    ) -> None:
        """Verify DELETE /patients/{id} removes the patient from the
        database and returns a success message."""
        # Arrange
        create_resp = client.post("/patients/", json=sample_patient_data)
        patient_id = create_resp.json()["id"]

        # Act
        delete_resp = client.delete(f"/patients/{patient_id}")

        # Assert
        assert delete_resp.status_code == 200, (
            f"Expected 200 OK, got {delete_resp.status_code}"
        )
        assert delete_resp.json() == {"message": "Patient deleted"}, (
            f"Expected deletion confirmation message, got {delete_resp.json()}"
        )

        # Verify the patient is truly gone
        get_resp = client.get(f"/patients/{patient_id}")
        assert get_resp.status_code == 404, (
            "Expected 404 when fetching deleted patient"
        )

    def test_delete_patient_not_found(self, client: TestClient) -> None:
        """Verify DELETE /patients/{invalid_id} returns 404 for a
        non-existent patient."""
        # Arrange
        fake_id = "00000000-0000-0000-0000-000000000000"

        # Act
        response = client.delete(f"/patients/{fake_id}")

        # Assert
        assert response.status_code == 404, (
            f"Expected 404 Not Found, got {response.status_code}"
        )
