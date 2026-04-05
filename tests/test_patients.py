"""
Tests for patient CRUD endpoints: create, read, update, delete, search,
pagination, and auth protection.
"""

import uuid

from fastapi.testclient import TestClient


class TestCreatePatient:
    """Verify patient creation via POST /api/patients."""

    def test_create_patient_returns_201(
        self, client: TestClient, auth_headers: dict, sample_patient_data: dict
    ):
        """POST /api/patients creates new patient and returns 201 status
        with patient data when all required fields are provided."""
        # Arrange -- sample_patient_data and auth_headers provided by fixtures

        # Act
        response = client.post(
            "/api/patients",
            json=sample_patient_data,
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 201, (
            f"Expected 201 for patient creation, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["first_name"] == sample_patient_data["first_name"], (
            f"Expected first_name '{sample_patient_data['first_name']}', got {data.get('first_name')}"
        )
        assert data["last_name"] == sample_patient_data["last_name"], (
            f"Expected last_name '{sample_patient_data['last_name']}', got {data.get('last_name')}"
        )
        assert "id" in data, "Response missing 'id' field"
        assert "created_at" in data, "Response missing 'created_at' field"

    def test_create_patient_missing_required_field_returns_422(
        self, client: TestClient, auth_headers: dict
    ):
        """POST /api/patients returns 422 status when required fields
        (first_name, last_name, date_of_birth) are missing."""
        # Arrange -- incomplete payload: missing last_name and date_of_birth
        incomplete_data = {"first_name": "Jane"}

        # Act
        response = client.post(
            "/api/patients",
            json=incomplete_data,
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 for missing required fields, got {response.status_code}: {response.text}"
        )


class TestListPatients:
    """Verify listing, search, and pagination for GET /api/patients."""

    def test_list_patients_returns_paginated_results(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """GET /api/patients returns paginated response with items, total,
        page, and page_size fields."""
        # Arrange -- created_patient already exists in DB

        # Act
        response = client.get("/api/patients", headers=auth_headers)

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for patient list, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "items" in data, "Paginated response missing 'items' field"
        assert "total" in data, "Paginated response missing 'total' field"
        assert "page" in data, "Paginated response missing 'page' field"
        assert "page_size" in data, "Paginated response missing 'page_size' field"
        assert isinstance(data["items"], list), "'items' should be a list"
        assert data["total"] >= 1, (
            f"Expected total >= 1, got {data['total']}"
        )

    def test_list_patients_search_filters_by_name_case_insensitive(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """GET /api/patients?search=jane returns patients with 'jane' in
        first_name or last_name, case-insensitive."""
        # Arrange -- created_patient has first_name='Jane'

        # Act
        response = client.get(
            "/api/patients", params={"search": "jane"}, headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for search, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["total"] >= 1, (
            "Expected at least 1 patient matching 'jane' (case-insensitive)"
        )
        # Verify the returned patient's name contains the search term
        for item in data["items"]:
            full_name_lower = f"{item['first_name']} {item['last_name']}".lower()
            assert "jane" in full_name_lower or "jane" in item.get("email", "").lower(), (
                f"Patient {item.get('first_name')} {item.get('last_name')} does not match search 'jane'"
            )

    def test_list_patients_search_filters_by_email(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """GET /api/patients?search=jane.doe@example.com returns patients
        with matching email address, case-insensitive."""
        # Arrange -- created_patient has email='jane.doe@example.com'

        # Act
        response = client.get(
            "/api/patients",
            params={"search": "jane.doe@example.com"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for email search, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["total"] >= 1, (
            "Expected at least 1 patient matching email 'jane.doe@example.com'"
        )

    def test_list_patients_pagination(
        self, client: TestClient, auth_headers: dict
    ):
        """GET /api/patients with page and page_size params returns the
        correct slice of results."""
        # Arrange -- create multiple patients
        for i in range(3):
            client.post(
                "/api/patients",
                json={
                    "first_name": f"Patient{i}",
                    "last_name": "Test",
                    "date_of_birth": "2000-01-01",
                },
                headers=auth_headers,
            )

        # Act -- request page 1 with page_size 2
        response = client.get(
            "/api/patients",
            params={"page": 1, "page_size": 2},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert len(data["items"]) <= 2, (
            f"Expected at most 2 items per page, got {len(data['items'])}"
        )
        assert data["page"] == 1, f"Expected page 1, got {data['page']}"
        assert data["page_size"] == 2, f"Expected page_size 2, got {data['page_size']}"


class TestGetPatient:
    """Verify retrieval of a single patient by ID."""

    def test_get_patient_by_id_returns_patient_data(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """GET /api/patients/{id} returns 200 status with complete patient
        data when patient exists."""
        # Arrange
        patient_id = created_patient["id"]

        # Act
        response = client.get(
            f"/api/patients/{patient_id}", headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["id"] == patient_id, (
            f"Expected id '{patient_id}', got {data.get('id')}"
        )
        assert data["first_name"] == created_patient["first_name"], (
            f"Expected first_name '{created_patient['first_name']}', got {data.get('first_name')}"
        )

    def test_get_patient_not_found_returns_404(
        self, client: TestClient, auth_headers: dict
    ):
        """GET /api/patients/{invalid_id} returns 404 status when patient
        does not exist."""
        # Arrange
        nonexistent_id = str(uuid.uuid4())

        # Act
        response = client.get(
            f"/api/patients/{nonexistent_id}", headers=auth_headers
        )

        # Assert
        assert response.status_code == 404, (
            f"Expected 404 for nonexistent patient, got {response.status_code}: {response.text}"
        )


class TestUpdatePatient:
    """Verify patient update via PUT /api/patients/{id}."""

    def test_update_patient_returns_updated_data(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """PUT /api/patients/{id} updates patient and returns 200 status
        with updated data when valid data provided."""
        # Arrange
        patient_id = created_patient["id"]
        update_data = {"first_name": "Janet", "last_name": "Smith"}

        # Act
        response = client.put(
            f"/api/patients/{patient_id}",
            json=update_data,
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for update, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["first_name"] == "Janet", (
            f"Expected updated first_name 'Janet', got {data.get('first_name')}"
        )
        assert data["last_name"] == "Smith", (
            f"Expected updated last_name 'Smith', got {data.get('last_name')}"
        )

    def test_update_patient_invalid_data_returns_422(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """PUT /api/patients/{id} returns 422 status when invalid data
        (e.g., invalid date_of_birth format) is provided."""
        # Arrange
        patient_id = created_patient["id"]
        invalid_data = {"date_of_birth": "not-a-date"}

        # Act
        response = client.put(
            f"/api/patients/{patient_id}",
            json=invalid_data,
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 for invalid data, got {response.status_code}: {response.text}"
        )


class TestDeletePatient:
    """Verify patient deletion via DELETE /api/patients/{id}."""

    def test_delete_patient_returns_204(
        self, client: TestClient, auth_headers: dict, created_patient: dict
    ):
        """DELETE /api/patients/{id} returns 204 status when patient is
        successfully deleted."""
        # Arrange
        patient_id = created_patient["id"]

        # Act
        response = client.delete(
            f"/api/patients/{patient_id}", headers=auth_headers
        )

        # Assert
        assert response.status_code == 204, (
            f"Expected 204 for deletion, got {response.status_code}: {response.text}"
        )

        # Confirm the patient is gone
        get_response = client.get(
            f"/api/patients/{patient_id}", headers=auth_headers
        )
        assert get_response.status_code == 404, (
            "Patient should not be found after deletion"
        )


class TestPatientAuthProtection:
    """Verify that patient endpoints require authentication."""

    def test_patients_endpoint_requires_auth(self, client: TestClient, seed_admin):
        """All patient endpoints return 401 status when no valid JWT token
        is provided."""
        # Arrange -- no auth headers
        dummy_id = str(uuid.uuid4())

        # Act / Assert
        endpoints = [
            ("GET", "/api/patients"),
            ("POST", "/api/patients"),
            ("GET", f"/api/patients/{dummy_id}"),
            ("PUT", f"/api/patients/{dummy_id}"),
            ("DELETE", f"/api/patients/{dummy_id}"),
        ]

        for method, url in endpoints:
            response = client.request(method, url)
            assert response.status_code == 401, (
                f"{method} {url} should return 401 without auth, got {response.status_code}"
            )
