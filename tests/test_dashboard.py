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


# ---------------------------------------------------------------------------
# New test stubs for dashboard analytics and reporting (RED phase)
# These tests target the /dashboard/metrics endpoint and DashboardResponse
# schema that do not exist yet -- they are expected to FAIL.
# ---------------------------------------------------------------------------


def test_get_dashboard_metrics_returns_accurate_counts(
    client: TestClient, create_patient, create_appointment
) -> None:
    """AC1: Verify that dashboard metrics endpoint returns accurate total
    patients, appointments, and status counts with proper aggregation.

    The GET /dashboard/metrics endpoint should aggregate all patients and
    appointments, returning correct totals and per-status counts.
    """
    # Arrange -- create a mix of patients and appointments
    patient1 = create_patient(first_name="Alice", last_name="Metrics")
    patient2 = create_patient(
        first_name="Bob", last_name="Metrics", phone_number="555-888-0001"
    )
    patient3 = create_patient(
        first_name="Carol", last_name="Metrics", phone_number="555-888-0002"
    )

    now = datetime.utcnow()

    create_appointment(
        patient_id=patient1["id"],
        date_time=(now + timedelta(days=3)).isoformat(),
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
        patient_id=patient3["id"],
        date_time=(now - timedelta(days=5)).isoformat(),
        appointment_type="consultation",
        status="cancelled",
    )
    create_appointment(
        patient_id=patient1["id"],
        date_time=(now - timedelta(days=2)).isoformat(),
        appointment_type="checkup",
        status="completed",
    )

    # Act -- call the metrics endpoint (does not exist yet)
    response = client.get("/dashboard/metrics")

    # Assert -- endpoint must exist and return 200
    assert response.status_code == 200, (
        f"Expected 200 from /dashboard/metrics, got {response.status_code}"
    )
    data = response.json()

    assert data["total_patients"] == 3, (
        "Metrics should report 3 total patients"
    )
    assert data["total_appointments"] == 4, (
        "Metrics should report 4 total appointments"
    )
    assert data["status_counts"]["completed"] == 2, (
        "Metrics should report 2 completed appointments in status_counts"
    )
    assert data["status_counts"]["cancelled"] == 1, (
        "Metrics should report 1 cancelled appointment in status_counts"
    )
    assert data["status_counts"]["scheduled"] == 1, (
        "Metrics should report 1 scheduled appointment in status_counts"
    )


def test_dashboard_metrics_follows_response_schema(
    client: TestClient, create_patient, create_appointment
) -> None:
    """AC2: Verify that dashboard API endpoint returns properly structured
    analytics data following DashboardResponse schema format.

    The response must conform to the DashboardResponse Pydantic schema
    defined in app.schemas, including all required top-level fields.
    """
    # Arrange -- create minimal data so response is populated
    patient = create_patient(first_name="Schema", last_name="Test")
    now = datetime.utcnow()
    create_appointment(
        patient_id=patient["id"],
        date_time=(now + timedelta(days=1)).isoformat(),
        appointment_type="checkup",
        status="scheduled",
    )

    # Act
    response = client.get("/dashboard/metrics")

    # Assert -- endpoint returns 200
    assert response.status_code == 200, (
        f"Expected 200 from /dashboard/metrics, got {response.status_code}"
    )
    data = response.json()

    # Validate that response can be parsed by the DashboardResponse schema
    from app.schemas import DashboardResponse  # noqa: E402

    parsed = DashboardResponse(**data)

    assert parsed.total_patients >= 0, (
        "DashboardResponse.total_patients must be a non-negative integer"
    )
    assert parsed.total_appointments >= 0, (
        "DashboardResponse.total_appointments must be a non-negative integer"
    )
    assert hasattr(parsed, "status_counts"), (
        "DashboardResponse must include a status_counts field"
    )
    assert hasattr(parsed, "upcoming_appointments"), (
        "DashboardResponse must include an upcoming_appointments field"
    )


def test_dashboard_supports_date_range_filtering(
    client: TestClient, create_patient, create_appointment
) -> None:
    """AC3: Verify that dashboard endpoint supports date range filtering via
    start_date/end_date query parameters for trend analysis.

    When start_date and end_date are provided, only appointments and
    metrics within that window should be included in the response.
    """
    # Arrange -- create appointments across different date ranges
    patient = create_patient(first_name="DateRange", last_name="Test")

    create_appointment(
        patient_id=patient["id"],
        date_time="2026-01-15T10:00:00",
        appointment_type="checkup",
        status="completed",
    )
    create_appointment(
        patient_id=patient["id"],
        date_time="2026-02-15T10:00:00",
        appointment_type="followup",
        status="completed",
    )
    create_appointment(
        patient_id=patient["id"],
        date_time="2026-03-15T10:00:00",
        appointment_type="consultation",
        status="scheduled",
    )

    # Act -- filter to February only
    response = client.get(
        "/dashboard/metrics",
        params={"start_date": "2026-02-01", "end_date": "2026-02-28"},
    )

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 from /dashboard/metrics with date filter, "
        f"got {response.status_code}"
    )
    data = response.json()

    assert data["total_appointments"] == 1, (
        "Date-filtered metrics should include only the 1 appointment in "
        "the February date range"
    )
    assert data["status_counts"]["completed"] == 1, (
        "The single appointment in February should be counted as completed"
    )


def test_dashboard_endpoint_with_invalid_date_range(
    client: TestClient,
) -> None:
    """AC6: Verify that dashboard API returns 422 error when provided with
    invalid start_date/end_date parameters.

    Malformed date strings should be rejected by FastAPI's query parameter
    validation and return a 422 Unprocessable Entity response.
    """
    # Act -- send completely invalid date string to /dashboard/metrics
    response = client.get(
        "/dashboard/metrics",
        params={"start_date": "not-a-valid-date", "end_date": "2026-03-31"},
    )

    # Assert
    assert response.status_code == 422, (
        f"Expected 422 for invalid start_date on /dashboard/metrics, "
        f"got {response.status_code}"
    )

    # Act -- send valid start but invalid end
    response2 = client.get(
        "/dashboard/metrics",
        params={"start_date": "2026-01-01", "end_date": "31-13-2026"},
    )

    # Assert
    assert response2.status_code == 422, (
        f"Expected 422 for invalid end_date on /dashboard/metrics, "
        f"got {response2.status_code}"
    )
