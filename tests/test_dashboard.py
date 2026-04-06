"""Tests for dashboard analytics endpoints.

These tests cover the comprehensive dashboard analytics system including
stats overview, patient analytics, appointment analytics, recent activity,
and model validation. They are expected to FAIL in the RED phase because
the expanded implementation does not exist yet.
"""

from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError


class TestDashboardStatsEndpoint:
    """Tests for the main dashboard stats overview endpoint."""

    def test_dashboard_stats_endpoint_returns_comprehensive_statistics(
        self, client: TestClient, create_patient, create_appointment
    ) -> None:
        """Verify dashboard stats endpoint returns complete overview with
        total patients, new patients this month, and appointment breakdowns
        by status when database has sample data.
        """
        # Arrange -- create patients and appointments with various statuses
        patient1 = create_patient(first_name="Alice", last_name="Smith")
        patient2 = create_patient(
            first_name="Bob", last_name="Jones", phone_number="555-999-0001"
        )

        now = datetime.utcnow()
        future = (now + timedelta(days=7)).isoformat()

        create_appointment(
            patient_id=patient1["id"],
            date_time=future,
            appointment_type="checkup",
            status="scheduled",
        )
        create_appointment(
            patient_id=patient2["id"],
            date_time=(now - timedelta(days=1)).isoformat(),
            appointment_type="followup",
            status="completed",
        )
        create_appointment(
            patient_id=patient1["id"],
            date_time=(now - timedelta(days=2)).isoformat(),
            appointment_type="consultation",
            status="cancelled",
        )

        # Act
        response = client.get("/dashboard/stats")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for dashboard stats, got {response.status_code}"
        )
        data = response.json()
        assert data["total_patients"] == 2, (
            "Expected 2 total patients in dashboard stats"
        )
        assert "new_patients_this_month" in data, (
            "Dashboard stats must include new_patients_this_month"
        )
        assert data["total_appointments"] == 3, (
            "Expected 3 total appointments in dashboard stats"
        )
        assert data["completed_appointments_count"] == 1, (
            "Expected 1 completed appointment"
        )
        assert data["cancelled_appointments_count"] == 1, (
            "Expected 1 cancelled appointment"
        )
        assert data["scheduled_appointments_count"] == 1, (
            "Expected 1 scheduled appointment"
        )


class TestPatientAnalyticsEndpoint:
    """Tests for the patient analytics endpoint."""

    def test_patient_analytics_endpoint_calculates_growth_rates(
        self, client: TestClient, create_patient
    ) -> None:
        """Verify patient analytics endpoint returns growth rates and trend
        data correctly when comparing current vs previous month patient counts.
        """
        # Arrange -- create patients to establish baseline data
        create_patient(first_name="Alice", last_name="Smith")
        create_patient(
            first_name="Bob", last_name="Jones", phone_number="555-999-0002"
        )

        # Act
        response = client.get("/dashboard/patients/stats")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for patient analytics, got {response.status_code}"
        )
        data = response.json()
        assert "growth_rate" in data, (
            "Patient analytics must include growth_rate"
        )
        assert "current_month_count" in data, (
            "Patient analytics must include current_month_count"
        )
        assert "previous_month_count" in data, (
            "Patient analytics must include previous_month_count"
        )
        assert isinstance(data["growth_rate"], (int, float)), (
            "Growth rate must be a numeric value"
        )


class TestAppointmentAnalyticsEndpoint:
    """Tests for the appointment analytics endpoint."""

    def test_appointment_analytics_endpoint_groups_by_status(
        self, client: TestClient, create_patient, create_appointment
    ) -> None:
        """Verify appointment analytics endpoint returns proper breakdown of
        appointments grouped by status (scheduled, completed, cancelled)
        with accurate counts.
        """
        # Arrange
        patient = create_patient()
        now = datetime.utcnow()

        create_appointment(
            patient_id=patient["id"],
            date_time=(now + timedelta(days=1)).isoformat(),
            appointment_type="checkup",
            status="scheduled",
        )
        create_appointment(
            patient_id=patient["id"],
            date_time=(now + timedelta(days=2)).isoformat(),
            appointment_type="followup",
            status="scheduled",
        )
        create_appointment(
            patient_id=patient["id"],
            date_time=(now - timedelta(days=1)).isoformat(),
            appointment_type="consultation",
            status="completed",
        )
        create_appointment(
            patient_id=patient["id"],
            date_time=(now - timedelta(days=3)).isoformat(),
            appointment_type="checkup",
            status="cancelled",
        )

        # Act
        response = client.get("/dashboard/appointments/stats")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for appointment analytics, got {response.status_code}"
        )
        data = response.json()
        assert "status_breakdown" in data, (
            "Appointment analytics must include status_breakdown"
        )
        breakdown = data["status_breakdown"]
        assert breakdown["scheduled"] == 2, (
            "Expected 2 scheduled appointments in breakdown"
        )
        assert breakdown["completed"] == 1, (
            "Expected 1 completed appointment in breakdown"
        )
        assert breakdown["cancelled"] == 1, (
            "Expected 1 cancelled appointment in breakdown"
        )


class TestRecentActivityEndpoint:
    """Tests for the recent activity feed endpoint."""

    def test_recent_activity_endpoint_returns_chronological_events(
        self, client: TestClient, create_patient, create_appointment
    ) -> None:
        """Verify recent activity endpoint returns patient and appointment
        events in reverse chronological order with descriptive messages.
        """
        # Arrange
        patient = create_patient(first_name="Alice", last_name="Smith")
        now = datetime.utcnow()

        create_appointment(
            patient_id=patient["id"],
            date_time=(now + timedelta(days=1)).isoformat(),
            appointment_type="checkup",
        )

        # Act
        response = client.get("/dashboard/recent-activity")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for recent activity, got {response.status_code}"
        )
        data = response.json()
        assert "activities" in data, (
            "Recent activity response must include activities list"
        )
        activities = data["activities"]
        assert len(activities) >= 1, (
            "Expected at least one activity event"
        )

        # Verify each activity has required fields
        for activity in activities:
            assert "message" in activity, (
                "Each activity must include a descriptive message"
            )
            assert "timestamp" in activity, (
                "Each activity must include a timestamp"
            )

        # Verify reverse chronological order
        timestamps = [a["timestamp"] for a in activities]
        assert timestamps == sorted(timestamps, reverse=True), (
            "Activities must be in reverse chronological order"
        )


class TestDashboardEmptyDatabase:
    """Tests for dashboard behavior with no data."""

    def test_dashboard_endpoints_handle_empty_database(
        self, client: TestClient
    ) -> None:
        """Verify all dashboard endpoints return appropriate zero values
        and empty arrays when no data exists in database.
        """
        # Act -- call stats endpoint
        stats_response = client.get("/dashboard/stats")

        # Assert -- stats should return zeros
        assert stats_response.status_code == 200, (
            f"Expected 200 for empty dashboard stats, got {stats_response.status_code}"
        )
        stats_data = stats_response.json()
        assert stats_data["total_patients"] == 0, (
            "Expected 0 total patients when database is empty"
        )
        assert stats_data["total_appointments"] == 0, (
            "Expected 0 total appointments when database is empty"
        )

        # Act -- call patient analytics endpoint
        patient_response = client.get("/dashboard/patients/stats")

        # Assert -- patient analytics should return zeros
        assert patient_response.status_code == 200, (
            f"Expected 200 for empty patient analytics, got {patient_response.status_code}"
        )
        patient_data = patient_response.json()
        assert patient_data["growth_rate"] == 0, (
            "Expected 0% growth rate when no patients exist"
        )

        # Act -- call recent activity endpoint
        activity_response = client.get("/dashboard/recent-activity")

        # Assert -- recent activity should return empty list
        assert activity_response.status_code == 200, (
            f"Expected 200 for empty recent activity, got {activity_response.status_code}"
        )
        activity_data = activity_response.json()
        assert activity_data["activities"] == [], (
            "Expected empty activities list when database is empty"
        )


class TestDashboardModelValidation:
    """Tests for Pydantic model validation on dashboard models."""

    def test_dashboard_models_validate_rate_bounds(self) -> None:
        """Verify dashboard models reject rate values outside 0-100
        range and negative integer counts with proper validation errors.
        """
        from app.models.dashboard import AppointmentStats, DashboardStats

        # Completion rate above 100 should be rejected
        with pytest.raises(ValidationError, match="rate|bounds|less than or equal"):
            AppointmentStats(
                total_scheduled=5,
                completed=3,
                cancelled=1,
                no_show=0,
                completion_rate=150.0,
            )

        # Negative counts should be rejected
        with pytest.raises(ValidationError, match="count|greater than|negative"):
            DashboardStats(
                total_patients=-1,
                total_appointments=5,
                appointments_today=0,
                new_patients_this_month=0,
            )


class TestDashboardDateValidation:
    """Tests for date parameter validation on dashboard endpoints."""

    def test_dashboard_endpoints_return_422_for_invalid_date_params(
        self, client: TestClient
    ) -> None:
        """Verify dashboard endpoints return 422 status code with validation
        errors when provided with malformed date parameters.
        """
        # Act -- send malformed date_from parameter
        response = client.get(
            "/dashboard/patients/stats",
            params={"date_from": "not-a-date"},
        )

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 for malformed date_from, got {response.status_code}"
        )

        # Act -- send malformed date_to parameter
        response = client.get(
            "/dashboard/appointments/stats",
            params={"date_from": "2026-01-01", "date_to": "invalid-date"},
        )

        # Assert
        assert response.status_code == 422, (
            f"Expected 422 for malformed date_to, got {response.status_code}"
        )
