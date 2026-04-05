"""
Tests for appointment CRUD endpoints: create, read, update, delete, status
transitions, calendar view, and auth protection.
"""

import uuid

from fastapi.testclient import TestClient


class TestCreateAppointment:
    """Verify appointment creation via POST /api/appointments."""

    def test_create_appointment_returns_201(
        self,
        client: TestClient,
        auth_headers: dict,
        sample_appointment_data: dict,
    ):
        """POST /api/appointments creates new appointment and returns 201
        status with appointment data when valid patient_id and required
        fields are provided."""
        # Arrange -- sample_appointment_data references an existing patient

        # Act
        response = client.post(
            "/api/appointments",
            json=sample_appointment_data,
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 201, (
            f"Expected 201 for appointment creation, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "id" in data, "Response missing 'id' field"
        assert data["patient_id"] == sample_appointment_data["patient_id"], (
            f"Expected patient_id '{sample_appointment_data['patient_id']}', "
            f"got {data.get('patient_id')}"
        )
        assert data["status"] == "scheduled", (
            f"Expected default status 'scheduled', got {data.get('status')}"
        )

    def test_create_appointment_invalid_patient_returns_404(
        self, client: TestClient, auth_headers: dict
    ):
        """POST /api/appointments returns 404 status when patient_id does
        not exist in the database."""
        # Arrange
        data = {
            "patient_id": str(uuid.uuid4()),
            "appointment_date": "2024-06-15",
            "appointment_time": "10:00:00",
            "duration_minutes": 30,
        }

        # Act
        response = client.post(
            "/api/appointments", json=data, headers=auth_headers
        )

        # Assert
        assert response.status_code == 404, (
            f"Expected 404 for nonexistent patient, got {response.status_code}: {response.text}"
        )

    def test_create_appointment_missing_fields_returns_422(
        self, client: TestClient, auth_headers: dict
    ):
        """POST /api/appointments returns 422 status when required fields
        (patient_id, appointment_date, appointment_time) are missing."""
        # Arrange -- empty payload
        data = {}

        # Act
        response = client.post(
            "/api/appointments", json=data, headers=auth_headers
        )

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 for missing fields, got {response.status_code}: {response.text}"
        )


class TestListAppointments:
    """Verify listing, filtering, and pagination for GET /api/appointments."""

    def test_list_appointments_returns_paginated(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """GET /api/appointments returns paginated response with items,
        total, page, and page_size fields."""
        # Arrange -- created_appointment already exists

        # Act
        response = client.get("/api/appointments", headers=auth_headers)

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "items" in data, "Paginated response missing 'items' field"
        assert "total" in data, "Paginated response missing 'total' field"
        assert "page" in data, "Paginated response missing 'page' field"
        assert "page_size" in data, "Paginated response missing 'page_size' field"
        assert data["total"] >= 1, f"Expected total >= 1, got {data['total']}"

    def test_list_appointments_filter_by_status(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """GET /api/appointments?status=scheduled returns only appointments
        with the specified status."""
        # Arrange -- created_appointment has default status 'scheduled'

        # Act
        response = client.get(
            "/api/appointments",
            params={"status": "scheduled"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        for item in data["items"]:
            assert item["status"] == "scheduled", (
                f"Expected all items to have status 'scheduled', got '{item['status']}'"
            )

    def test_list_appointments_filter_by_date_range(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """GET /api/appointments?date_from=2024-01-01&date_to=2024-12-31
        returns only appointments within the specified date range."""
        # Arrange -- created_appointment has appointment_date='2024-06-15'

        # Act
        response = client.get(
            "/api/appointments",
            params={"date_from": "2024-01-01", "date_to": "2024-12-31"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["total"] >= 1, (
            "Expected at least 1 appointment in the 2024 date range"
        )
        for item in data["items"]:
            assert "2024-01-01" <= item["appointment_date"] <= "2024-12-31", (
                f"Appointment date {item['appointment_date']} outside range 2024-01-01..2024-12-31"
            )


class TestUpdateAppointmentStatus:
    """Verify appointment status transition validation via
    PATCH /api/appointments/{id}/status."""

    def test_update_status_scheduled_to_completed_succeeds(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """PATCH /api/appointments/{id}/status transitions from 'scheduled'
        to 'completed' and returns 200 status."""
        # Arrange
        appointment_id = created_appointment["id"]

        # Act
        response = client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "completed"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for scheduled->completed, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["status"] == "completed", (
            f"Expected status 'completed', got {data.get('status')}"
        )

    def test_update_status_scheduled_to_cancelled_succeeds(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """PATCH /api/appointments/{id}/status transitions from 'scheduled'
        to 'cancelled' and returns 200 status."""
        # Arrange
        appointment_id = created_appointment["id"]

        # Act
        response = client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "cancelled"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for scheduled->cancelled, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["status"] == "cancelled", (
            f"Expected status 'cancelled', got {data.get('status')}"
        )

    def test_update_status_completed_to_scheduled_rejected_400(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """PATCH /api/appointments/{id}/status transition from 'completed'
        to 'scheduled' is rejected with 400 status."""
        # Arrange -- first transition to 'completed'
        appointment_id = created_appointment["id"]
        client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "completed"},
            headers=auth_headers,
        )

        # Act -- attempt invalid transition back to 'scheduled'
        response = client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "scheduled"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 400, (
            f"Expected 400 for completed->scheduled, got {response.status_code}: {response.text}"
        )

    def test_update_status_cancelled_to_completed_rejected_400(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """PATCH /api/appointments/{id}/status transition from 'cancelled'
        to 'completed' is rejected with 400 status."""
        # Arrange -- first transition to 'cancelled'
        appointment_id = created_appointment["id"]
        client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "cancelled"},
            headers=auth_headers,
        )

        # Act -- attempt invalid transition to 'completed'
        response = client.patch(
            f"/api/appointments/{appointment_id}/status",
            json={"status": "completed"},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 400, (
            f"Expected 400 for cancelled->completed, got {response.status_code}: {response.text}"
        )


class TestCalendar:
    """Verify the calendar endpoint returns grouped day counts."""

    def test_calendar_endpoint_returns_grouped_day_counts(
        self,
        client: TestClient,
        auth_headers: dict,
        created_patient: dict,
    ):
        """GET /api/appointments/calendar?year=2024&month=6 returns calendar
        response with day counts grouped by date."""
        # Arrange -- create multiple appointments on different days in June 2024
        for day in [10, 10, 15, 20]:
            client.post(
                "/api/appointments",
                json={
                    "patient_id": created_patient["id"],
                    "appointment_date": f"2024-06-{day:02d}",
                    "appointment_time": "09:00:00",
                    "duration_minutes": 30,
                },
                headers=auth_headers,
            )

        # Act
        response = client.get(
            "/api/appointments/calendar",
            params={"year": 2024, "month": 6},
            headers=auth_headers,
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for calendar, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "days" in data, "Calendar response missing 'days' field"
        assert isinstance(data["days"], list), "'days' should be a list"

        # Verify that dates are grouped with counts
        day_map = {entry["date"]: entry["count"] for entry in data["days"]}

        # June 10 should have 2 appointments (created two above)
        assert day_map.get("2024-06-10", 0) >= 2, (
            f"Expected count >= 2 for 2024-06-10, got {day_map.get('2024-06-10', 0)}"
        )
        # June 15 should have at least 1 appointment
        assert day_map.get("2024-06-15", 0) >= 1, (
            f"Expected count >= 1 for 2024-06-15, got {day_map.get('2024-06-15', 0)}"
        )


class TestDeleteAppointment:
    """Verify appointment deletion via DELETE /api/appointments/{id}."""

    def test_delete_appointment_returns_204(
        self,
        client: TestClient,
        auth_headers: dict,
        created_appointment: dict,
    ):
        """DELETE /api/appointments/{id} returns 204 status when appointment
        is successfully deleted."""
        # Arrange
        appointment_id = created_appointment["id"]

        # Act
        response = client.delete(
            f"/api/appointments/{appointment_id}", headers=auth_headers
        )

        # Assert
        assert response.status_code == 204, (
            f"Expected 204 for deletion, got {response.status_code}: {response.text}"
        )


class TestAppointmentAuthProtection:
    """Verify that appointment endpoints require authentication."""

    def test_appointments_endpoint_requires_auth(
        self, client: TestClient, seed_admin
    ):
        """All appointment endpoints return 401 status when no valid JWT
        token is provided."""
        # Arrange -- no auth headers
        dummy_id = str(uuid.uuid4())

        # Act / Assert
        endpoints = [
            ("GET", "/api/appointments"),
            ("POST", "/api/appointments"),
            ("GET", f"/api/appointments/{dummy_id}"),
            ("PUT", f"/api/appointments/{dummy_id}"),
            ("PATCH", f"/api/appointments/{dummy_id}/status"),
            ("DELETE", f"/api/appointments/{dummy_id}"),
            ("GET", "/api/appointments/calendar"),
        ]

        for method, url in endpoints:
            response = client.request(method, url)
            assert response.status_code == 401, (
                f"{method} {url} should return 401 without auth, got {response.status_code}"
            )
