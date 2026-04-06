"""Tests for appointment API endpoints using the new schema.

The new appointment schema uses: patient_id, doctor_name, datetime, status, notes
instead of the old: patient_id, date_time, appointment_type, status, duration_minutes.
These tests target the refactored schema and should FAIL until the implementation
is updated.
"""

from fastapi.testclient import TestClient


class TestCreateAppointment:
    """Tests for POST /appointments/ with new schema fields."""

    def test_create_appointment_with_patient_id_doctor_name_datetime_status_notes(
        self, client: TestClient, create_patient
    ):
        """AC1: Verify that appointment can be created with exact required fields:
        patient_id (foreign key), doctor_name (string), datetime (datetime),
        status (string), notes (text).
        """
        # Arrange
        patient = create_patient()
        patient_id = patient["id"]
        payload = {
            "patient_id": patient_id,
            "doctor_name": "Dr. Smith",
            "datetime": "2026-06-15T09:30:00",
            "status": "scheduled",
            "notes": "Initial consultation for back pain",
        }

        # Act
        response = client.post("/appointments/", json=payload)

        # Assert
        assert response.status_code == 201, (
            f"Expected 201 Created, got {response.status_code}: {response.text}"
        )
        body = response.json()
        assert body["patient_id"] == patient_id, (
            "Returned patient_id should match the submitted value"
        )
        assert body["doctor_name"] == "Dr. Smith", (
            "Returned doctor_name should match the submitted value"
        )
        assert "2026-06-15" in body["datetime"], (
            "Returned datetime should contain the submitted date"
        )
        assert body["status"] == "scheduled", (
            "Returned status should match the submitted value"
        )
        assert body["notes"] == "Initial consultation for back pain", (
            "Returned notes should match the submitted value"
        )


class TestGetAppointment:
    """Tests for GET /appointments/{id} with new schema fields."""

    def test_get_appointment_returns_correct_field_structure(
        self, client: TestClient, create_patient
    ):
        """AC2: Verify that GET appointment endpoint returns appointment with
        patient_id relationship correctly handled and new field structure.
        """
        # Arrange
        patient = create_patient()
        patient_id = patient["id"]
        create_payload = {
            "patient_id": patient_id,
            "doctor_name": "Dr. Johnson",
            "datetime": "2026-07-01T14:00:00",
            "status": "scheduled",
            "notes": "Follow-up visit",
        }
        create_resp = client.post("/appointments/", json=create_payload)
        assert create_resp.status_code == 201, (
            f"Setup: expected 201, got {create_resp.status_code}"
        )
        appointment_id = create_resp.json()["id"]

        # Act
        response = client.get(f"/appointments/{appointment_id}")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        body = response.json()
        assert body["id"] == appointment_id, "Returned id should match"
        assert body["patient_id"] == patient_id, (
            "Returned patient_id should reference the correct patient"
        )
        assert body["doctor_name"] == "Dr. Johnson", (
            "Response must include doctor_name field with correct value"
        )
        assert "datetime" in body, (
            "Response must include 'datetime' field (not 'date_time')"
        )
        assert body["status"] == "scheduled", (
            "Response must include status field"
        )
        assert body["notes"] == "Follow-up visit", (
            "Response must include notes field with correct value"
        )
        # Verify old fields are NOT present
        assert "appointment_type" not in body, (
            "Old field 'appointment_type' should not be in response"
        )
        assert "duration_minutes" not in body, (
            "Old field 'duration_minutes' should not be in response"
        )
        assert "date_time" not in body, (
            "Old field 'date_time' should not be in response; use 'datetime'"
        )


class TestUpdateAppointment:
    """Tests for PUT /appointments/{id} with new schema fields."""

    def test_update_appointment_maintains_patient_relationship(
        self, client: TestClient, create_patient
    ):
        """AC2: Verify that PUT appointment endpoint updates appointment while
        maintaining correct patient_id relationship.
        """
        # Arrange
        patient_a = create_patient(first_name="Alice", last_name="Adams")
        patient_b = create_patient(first_name="Bob", last_name="Baker")
        create_payload = {
            "patient_id": patient_a["id"],
            "doctor_name": "Dr. Lee",
            "datetime": "2026-08-10T11:00:00",
            "status": "scheduled",
            "notes": "Routine checkup",
        }
        create_resp = client.post("/appointments/", json=create_payload)
        assert create_resp.status_code == 201, (
            f"Setup: expected 201, got {create_resp.status_code}"
        )
        appointment_id = create_resp.json()["id"]

        update_payload = {
            "patient_id": patient_b["id"],
            "doctor_name": "Dr. Patel",
            "notes": "Transferred to new doctor",
        }

        # Act
        response = client.put(
            f"/appointments/{appointment_id}", json=update_payload
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}: {response.text}"
        )
        body = response.json()
        assert body["patient_id"] == patient_b["id"], (
            "patient_id should be updated to the new patient"
        )
        assert body["doctor_name"] == "Dr. Patel", (
            "doctor_name should reflect the updated value"
        )
        assert body["notes"] == "Transferred to new doctor", (
            "notes should reflect the updated value"
        )


class TestDeleteAppointment:
    """Tests for DELETE /appointments/{id} with new schema fields."""

    def test_delete_appointment_with_patient_id_field(
        self, client: TestClient, create_patient
    ):
        """AC2: Verify that DELETE appointment endpoint removes appointment
        using patient_id field structure.
        """
        # Arrange
        patient = create_patient()
        create_payload = {
            "patient_id": patient["id"],
            "doctor_name": "Dr. Wilson",
            "datetime": "2026-09-20T08:30:00",
            "status": "scheduled",
            "notes": "Pre-surgery consultation",
        }
        create_resp = client.post("/appointments/", json=create_payload)
        assert create_resp.status_code == 201, (
            f"Setup: expected 201, got {create_resp.status_code}"
        )
        appointment_id = create_resp.json()["id"]

        # Act
        delete_resp = client.delete(f"/appointments/{appointment_id}")

        # Assert
        assert delete_resp.status_code == 204, (
            f"Expected 204 No Content, got {delete_resp.status_code}"
        )
        # Verify appointment is gone
        get_resp = client.get(f"/appointments/{appointment_id}")
        assert get_resp.status_code == 404, (
            "Deleted appointment should return 404 on subsequent GET"
        )


class TestFilterAppointments:
    """Tests for GET /appointments/ with query parameter filters."""

    def test_filter_appointments_by_patient_id_status_date_range(
        self, client: TestClient, create_patient
    ):
        """AC4: Verify that API supports filtering appointments by patient_id,
        status, and date range query parameters with correct field names.
        """
        # Arrange
        patient = create_patient()
        pid = patient["id"]

        appointments_data = [
            {
                "patient_id": pid,
                "doctor_name": "Dr. A",
                "datetime": "2026-05-01T09:00:00",
                "status": "scheduled",
                "notes": "Appointment 1",
            },
            {
                "patient_id": pid,
                "doctor_name": "Dr. B",
                "datetime": "2026-06-15T10:00:00",
                "status": "completed",
                "notes": "Appointment 2",
            },
            {
                "patient_id": pid,
                "doctor_name": "Dr. C",
                "datetime": "2026-07-20T11:00:00",
                "status": "scheduled",
                "notes": "Appointment 3",
            },
        ]
        for appt in appointments_data:
            resp = client.post("/appointments/", json=appt)
            assert resp.status_code == 201, (
                f"Setup: expected 201, got {resp.status_code}: {resp.text}"
            )

        # Act -- filter by patient_id and status
        response_status = client.get(
            "/appointments/",
            params={"patient_id": pid, "status": "scheduled"},
        )

        # Assert -- should return only the two 'scheduled' appointments
        assert response_status.status_code == 200, (
            f"Expected 200 OK, got {response_status.status_code}"
        )
        results_status = response_status.json()
        assert len(results_status) == 2, (
            f"Expected 2 scheduled appointments, got {len(results_status)}"
        )
        for appt in results_status:
            assert appt["status"] == "scheduled", (
                "All filtered results should have status 'scheduled'"
            )
            assert appt["patient_id"] == pid, (
                "All filtered results should belong to the queried patient"
            )

        # Act -- filter by date range
        response_range = client.get(
            "/appointments/",
            params={
                "patient_id": pid,
                "date_from": "2026-06-01",
                "date_to": "2026-07-01",
            },
        )

        # Assert -- should return only the June appointment
        assert response_range.status_code == 200, (
            f"Expected 200 OK, got {response_range.status_code}"
        )
        results_range = response_range.json()
        assert len(results_range) == 1, (
            f"Expected 1 appointment in date range, got {len(results_range)}"
        )
        assert results_range[0]["doctor_name"] == "Dr. B", (
            "The appointment in the date range should be Dr. B's"
        )


class TestDatetimeValidation:
    """Tests for datetime field validation and formatting."""

    def test_appointment_datetime_validation_and_formatting(
        self, client: TestClient, create_patient
    ):
        """AC5: Verify that appointment datetime fields are properly validated
        and formatted in API responses with consistent datetime handling.
        """
        # Arrange
        patient = create_patient()
        payload = {
            "patient_id": patient["id"],
            "doctor_name": "Dr. Garcia",
            "datetime": "2026-10-05T16:45:00",
            "status": "scheduled",
            "notes": "Datetime format test",
        }

        # Act
        create_resp = client.post("/appointments/", json=payload)

        # Assert -- creation succeeds
        assert create_resp.status_code == 201, (
            f"Expected 201 Created, got {create_resp.status_code}: {create_resp.text}"
        )
        body = create_resp.json()

        # The 'datetime' field should be a properly formatted ISO-8601 string
        assert "datetime" in body, (
            "Response must contain 'datetime' field (not 'date_time')"
        )
        dt_value = body["datetime"]
        assert "2026-10-05" in dt_value, (
            "datetime value should contain the correct date component"
        )
        assert "16:45" in dt_value, (
            "datetime value should contain the correct time component"
        )

        # Verify invalid datetime is rejected
        invalid_payload = {
            "patient_id": patient["id"],
            "doctor_name": "Dr. Garcia",
            "datetime": "not-a-valid-datetime",
            "status": "scheduled",
            "notes": "Should fail validation",
        }
        invalid_resp = client.post("/appointments/", json=invalid_payload)
        assert invalid_resp.status_code == 422, (
            f"Invalid datetime should return 422, got {invalid_resp.status_code}"
        )
