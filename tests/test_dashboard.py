"""
Tests for the dashboard metrics endpoint: aggregated counts, recent patients,
upcoming appointments, empty state, and auth protection.
"""

import datetime

from fastapi.testclient import TestClient


class TestDashboardMetrics:
    """Verify GET /api/dashboard/metrics returns correct aggregated data."""

    def test_dashboard_metrics_returns_correct_aggregated_counts(
        self,
        client: TestClient,
        auth_headers: dict,
        created_patient: dict,
    ):
        """GET /api/dashboard/metrics returns correct counts for
        total_patients, todays_appointments, and upcoming_week_appointments
        with sample data."""
        # Arrange -- create an appointment for today
        today = datetime.date.today().isoformat()
        client.post(
            "/api/appointments",
            json={
                "patient_id": created_patient["id"],
                "appointment_date": today,
                "appointment_time": "10:00:00",
                "duration_minutes": 30,
                "reason": "Today visit",
            },
            headers=auth_headers,
        )

        # Create an appointment within the next 7 days
        upcoming_date = (
            datetime.date.today() + datetime.timedelta(days=3)
        ).isoformat()
        client.post(
            "/api/appointments",
            json={
                "patient_id": created_patient["id"],
                "appointment_date": upcoming_date,
                "appointment_time": "14:00:00",
                "duration_minutes": 30,
                "reason": "Follow-up",
            },
            headers=auth_headers,
        )

        # Act
        response = client.get(
            "/api/dashboard/metrics", headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "total_patients" in data, "Missing 'total_patients' field"
        assert "todays_appointments" in data, "Missing 'todays_appointments' field"
        assert "upcoming_week_appointments" in data, (
            "Missing 'upcoming_week_appointments' field"
        )
        assert data["total_patients"] >= 1, (
            f"Expected total_patients >= 1, got {data['total_patients']}"
        )
        assert data["todays_appointments"] >= 1, (
            f"Expected todays_appointments >= 1, got {data['todays_appointments']}"
        )
        assert data["upcoming_week_appointments"] >= 1, (
            f"Expected upcoming_week_appointments >= 1, got {data['upcoming_week_appointments']}"
        )

    def test_dashboard_metrics_returns_recent_patients(
        self,
        client: TestClient,
        auth_headers: dict,
    ):
        """GET /api/dashboard/metrics returns list of up to 5 most recent
        patients ordered by created_at DESC."""
        # Arrange -- create 6 patients
        for i in range(6):
            client.post(
                "/api/patients",
                json={
                    "first_name": f"Recent{i}",
                    "last_name": "Patient",
                    "date_of_birth": "1985-03-20",
                },
                headers=auth_headers,
            )

        # Act
        response = client.get(
            "/api/dashboard/metrics", headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "recent_patients" in data, "Missing 'recent_patients' field"
        assert isinstance(data["recent_patients"], list), (
            "'recent_patients' should be a list"
        )
        assert len(data["recent_patients"]) <= 5, (
            f"Expected at most 5 recent patients, got {len(data['recent_patients'])}"
        )

    def test_dashboard_metrics_returns_upcoming_appointments(
        self,
        client: TestClient,
        auth_headers: dict,
        created_patient: dict,
    ):
        """GET /api/dashboard/metrics returns list of up to 5 next upcoming
        scheduled appointments ordered by date/time ASC."""
        # Arrange -- create 6 upcoming appointments
        for i in range(1, 7):
            future_date = (
                datetime.date.today() + datetime.timedelta(days=i)
            ).isoformat()
            client.post(
                "/api/appointments",
                json={
                    "patient_id": created_patient["id"],
                    "appointment_date": future_date,
                    "appointment_time": "09:00:00",
                    "duration_minutes": 30,
                },
                headers=auth_headers,
            )

        # Act
        response = client.get(
            "/api/dashboard/metrics", headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "upcoming_appointments" in data, (
            "Missing 'upcoming_appointments' field"
        )
        assert isinstance(data["upcoming_appointments"], list), (
            "'upcoming_appointments' should be a list"
        )
        assert len(data["upcoming_appointments"]) <= 5, (
            f"Expected at most 5 upcoming appointments, got {len(data['upcoming_appointments'])}"
        )

        # Verify ascending order by date
        dates = [appt["appointment_date"] for appt in data["upcoming_appointments"]]
        assert dates == sorted(dates), (
            f"Upcoming appointments not sorted by date ASC: {dates}"
        )

    def test_dashboard_metrics_empty_database(
        self, client: TestClient, auth_headers: dict
    ):
        """GET /api/dashboard/metrics returns zero counts and empty lists
        when database has no patient or appointment data."""
        # Arrange -- auth_headers uses seed_admin but no patients/appointments exist
        # Note: This test relies on the db_session fixture rolling back, so
        # there should be no leftover patients or appointments beyond what
        # the auth_headers fixture creates (only the admin user).

        # Act
        response = client.get(
            "/api/dashboard/metrics", headers=auth_headers
        )

        # Assert
        assert response.status_code == 200, (
            f"Expected 200, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert data["total_patients"] == 0, (
            f"Expected total_patients 0, got {data['total_patients']}"
        )
        assert data["todays_appointments"] == 0, (
            f"Expected todays_appointments 0, got {data['todays_appointments']}"
        )
        assert data["upcoming_week_appointments"] == 0, (
            f"Expected upcoming_week_appointments 0, got {data['upcoming_week_appointments']}"
        )
        assert data["recent_patients"] == [], (
            f"Expected empty recent_patients, got {data['recent_patients']}"
        )
        assert data["upcoming_appointments"] == [], (
            f"Expected empty upcoming_appointments, got {data['upcoming_appointments']}"
        )


class TestDashboardAuthProtection:
    """Verify that the dashboard endpoint requires authentication."""

    def test_dashboard_requires_auth(self, client: TestClient, seed_admin):
        """GET /api/dashboard/metrics returns 401 status when no valid JWT
        token is provided."""
        # Arrange -- no auth headers

        # Act
        response = client.get("/api/dashboard/metrics")

        # Assert
        assert response.status_code == 401, (
            f"Expected 401 without auth, got {response.status_code}: {response.text}"
        )
