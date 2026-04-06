"""Tests for Patient API endpoints with the updated 'name' field structure.

These tests verify that CRUD endpoints accept and return data using a single
'name' field instead of the legacy 'first_name' / 'last_name' pair.
"""

from fastapi.testclient import TestClient


def _new_patient_payload(**overrides: object) -> dict:
    """Return a patient payload using the new 'name' field schema."""
    defaults = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "555-123-4567",
        "date_of_birth": "1990-01-15",
    }
    defaults.update(overrides)
    return defaults


class TestCreatePatient:
    """POST /patients/ endpoint tests."""

    def test_create_patient_with_name_field_returns_success(
        self, client: TestClient
    ) -> None:
        """AC2: Verify that POST /patients endpoint accepts patient data with
        'name' field and returns 201 with created patient."""
        payload = _new_patient_payload()

        response = client.post("/patients/", json=payload)

        assert response.status_code == 201, (
            f"Expected 201 Created, got {response.status_code}"
        )
        body = response.json()
        assert body["name"] == "Jane Doe", (
            "Response should contain the 'name' field with the submitted value"
        )
        assert "first_name" not in body, (
            "Response must not contain legacy 'first_name' field"
        )
        assert "last_name" not in body, (
            "Response must not contain legacy 'last_name' field"
        )

    def test_create_patient_with_invalid_email_returns_422(
        self, client: TestClient
    ) -> None:
        """AC5: Verify that creating patient with invalid email format returns
        422 validation error."""
        payload = _new_patient_payload(email="not-an-email")

        response = client.post("/patients/", json=payload)

        assert response.status_code == 422, (
            f"Expected 422 Unprocessable Entity for invalid email, got {response.status_code}"
        )


class TestGetPatient:
    """GET /patients/{id} endpoint tests."""

    def test_get_patient_returns_name_field(
        self, client: TestClient
    ) -> None:
        """AC2: Verify that GET /patients/{id} endpoint returns patient data
        with 'name' field instead of first_name/last_name."""
        payload = _new_patient_payload()
        create_resp = client.post("/patients/", json=payload)
        assert create_resp.status_code == 201, (
            "Setup: patient creation should succeed"
        )
        patient_id = create_resp.json()["id"]

        response = client.get(f"/patients/{patient_id}")

        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        body = response.json()
        assert body["name"] == "Jane Doe", (
            "GET response should include the 'name' field"
        )
        assert "first_name" not in body, (
            "GET response must not contain legacy 'first_name' field"
        )
        assert "last_name" not in body, (
            "GET response must not contain legacy 'last_name' field"
        )


class TestUpdatePatient:
    """PUT /patients/{id} endpoint tests."""

    def test_update_patient_with_name_field_returns_success(
        self, client: TestClient
    ) -> None:
        """AC2: Verify that PUT /patients/{id} endpoint accepts and updates
        patient with 'name' field."""
        payload = _new_patient_payload()
        create_resp = client.post("/patients/", json=payload)
        assert create_resp.status_code == 201, (
            "Setup: patient creation should succeed"
        )
        patient_id = create_resp.json()["id"]

        update_payload = {"name": "John Smith"}
        response = client.put(f"/patients/{patient_id}", json=update_payload)

        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        body = response.json()
        assert body["name"] == "John Smith", (
            "Updated patient should reflect the new 'name' value"
        )


class TestDeletePatient:
    """DELETE /patients/{id} endpoint tests."""

    def test_delete_patient_removes_record(
        self, client: TestClient
    ) -> None:
        """AC2: Verify that DELETE /patients/{id} endpoint successfully
        removes patient record."""
        payload = _new_patient_payload()
        create_resp = client.post("/patients/", json=payload)
        assert create_resp.status_code == 201, (
            "Setup: patient creation should succeed"
        )
        patient_id = create_resp.json()["id"]

        delete_resp = client.delete(f"/patients/{patient_id}")
        assert delete_resp.status_code == 204, (
            f"Expected 204 No Content, got {delete_resp.status_code}"
        )

        get_resp = client.get(f"/patients/{patient_id}")
        assert get_resp.status_code == 404, (
            "Deleted patient should no longer be retrievable"
        )
