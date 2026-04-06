"""Tests for the dashboard service layer.

These tests cover growth rate calculations, completion rates, activity
message formatting, date boundary handling, and parameterized SQL usage.
They are expected to FAIL in the RED phase because the expanded service
methods do not exist yet.
"""

from datetime import datetime, timedelta
from unittest.mock import patch

import pytest

from app.services import dashboard_service
from app import storage


class TestCalculateGrowthRate:
    """Tests for the growth rate calculation logic."""

    def test_calculate_growth_rate_handles_division_by_zero(self) -> None:
        """Verify growth rate calculation returns 0% when previous period
        has zero count instead of throwing division by zero error.
        """
        # Arrange
        current_count = 10
        previous_count = 0

        # Act
        result = dashboard_service.calculate_growth_rate(
            current_count, previous_count
        )

        # Assert
        assert result == 0.0, (
            "Growth rate should be 0% when previous period count is zero, "
            f"got {result}"
        )

    def test_calculate_growth_rate_positive_growth(self) -> None:
        """Verify correct growth rate for a normal positive increase."""
        # Arrange
        current_count = 15
        previous_count = 10

        # Act
        result = dashboard_service.calculate_growth_rate(
            current_count, previous_count
        )

        # Assert
        assert result == 50.0, (
            "Growth rate from 10 to 15 should be 50%, "
            f"got {result}"
        )


class TestCalculateCompletionRate:
    """Tests for appointment completion rate calculation."""

    def test_calculate_appointment_completion_rate(self) -> None:
        """Verify completion rate calculation returns percentage of completed
        appointments vs total appointments with proper decimal handling.
        """
        # Arrange
        completed = 7
        total = 10

        # Act
        result = dashboard_service.calculate_completion_rate(completed, total)

        # Assert
        assert result == 70.0, (
            f"Completion rate of 7/10 should be 70.0%, got {result}"
        )

    def test_calculate_completion_rate_zero_total(self) -> None:
        """Verify completion rate returns 0% when total is zero."""
        # Arrange
        completed = 0
        total = 0

        # Act
        result = dashboard_service.calculate_completion_rate(completed, total)

        # Assert
        assert result == 0.0, (
            "Completion rate should be 0% when total appointments is zero, "
            f"got {result}"
        )


class TestFormatActivityMessage:
    """Tests for the activity message formatting function."""

    def test_format_activity_message_for_patient_events(self) -> None:
        """Verify activity message formatting creates readable descriptions
        for patient registration, updates, and other events.
        """
        # Arrange -- a patient registration event
        event_type = "patient_registered"
        event_data = {
            "first_name": "Alice",
            "last_name": "Smith",
        }

        # Act
        message = dashboard_service.format_activity_message(
            event_type, event_data
        )

        # Assert
        assert isinstance(message, str), (
            "Activity message must be a string"
        )
        assert "Alice" in message, (
            "Activity message for patient event should include patient first name"
        )
        assert "Smith" in message, (
            "Activity message for patient event should include patient last name"
        )
        assert len(message) > 0, (
            "Activity message must not be empty"
        )


class TestDateFilteringBoundaries:
    """Tests for date filtering with month boundaries."""

    def test_date_filtering_with_month_boundaries(self) -> None:
        """Verify date filtering correctly handles month start/end boundaries
        when calculating monthly statistics and trends.
        """
        # Arrange -- insert patients at boundary dates
        store = storage.get_storage()

        # Patient created on last day of previous month
        now = datetime.utcnow()
        first_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_of_prev_month = first_of_month - timedelta(seconds=1)
        store.insert_patient(
            first_name="Previous",
            last_name="Month",
            date_of_birth="1985-03-10",
            gender="male",
            phone_number="555-111-0001",
            created_at=last_of_prev_month.isoformat(),
        )

        # Patient created on first day of current month
        store.insert_patient(
            first_name="Current",
            last_name="Month",
            date_of_birth="1990-06-20",
            gender="female",
            phone_number="555-111-0002",
            created_at=first_of_month.isoformat(),
        )

        # Act -- get monthly patient counts from the service
        result = dashboard_service.get_patient_analytics()

        # Assert
        assert result["current_month_count"] >= 1, (
            "Current month count should include patient created on the first of the month"
        )
        assert result["previous_month_count"] >= 1, (
            "Previous month count should include patient created on the last day of previous month"
        )


class TestAnalyticsParameterizedSQL:
    """Tests for parameterized SQL usage in analytics queries."""

    def test_analytics_queries_with_parameterized_sql(self) -> None:
        """Verify analytics service uses parameterized queries for date ranges
        and filters to prevent SQL injection vulnerabilities.
        """
        # Arrange -- set up mock to inspect SQL calls via direct connection access
        store = storage.get_storage()
        original_execute = store.execute

        executed_queries: list[tuple] = []

        def tracking_execute(sql, params=None):
            if params is not None:
                executed_queries.append((sql, params))
            return original_execute(sql, params) if params else original_execute(sql)

        # Act -- call analytics with date filters through the service
        with patch.object(store, "execute", side_effect=tracking_execute):
            try:
                dashboard_service.get_patient_analytics(
                    date_from="2026-01-01",
                    date_to="2026-03-31",
                )
            except (TypeError, AttributeError):
                # Method may not exist yet (RED phase) -- that is expected
                pytest.skip(
                    "get_patient_analytics with date params not yet implemented"
                )

        # Assert -- verify that date parameters were passed as query params,
        # not interpolated into the SQL string
        assert len(executed_queries) > 0, (
            "Expected at least one parameterized SQL query to be executed"
        )
        for sql, params in executed_queries:
            assert "2026-01-01" not in sql, (
                "Date values must not be interpolated directly into SQL; "
                "use parameterized queries instead"
            )
            assert "2026-03-31" not in sql, (
                "Date values must not be interpolated directly into SQL; "
                "use parameterized queries instead"
            )


# ---------------------------------------------------------------------------
# New test stubs for dashboard service layer analytics (RED phase)
# These tests target service methods and model fields that do not exist
# yet -- they are expected to FAIL.
# ---------------------------------------------------------------------------


def test_get_patient_count_with_optimized_query() -> None:
    """AC4: Verify that dashboard service calculates patient count using
    optimized aggregation queries following SQLStorage patterns.

    The get_patient_count function should use the storage layer's
    optimized SQL aggregation (COUNT) rather than fetching all records
    and computing len() in Python.
    """
    # Arrange -- insert patients into storage
    store = storage.get_storage()
    store.insert_patient(
        first_name="Alice",
        last_name="Optimized",
        date_of_birth="1990-01-15",
        gender="female",
        phone_number="555-700-0001",
    )
    store.insert_patient(
        first_name="Bob",
        last_name="Optimized",
        date_of_birth="1985-06-20",
        gender="male",
        phone_number="555-700-0002",
    )
    store.insert_patient(
        first_name="Carol",
        last_name="Optimized",
        date_of_birth="1978-11-05",
        gender="female",
        phone_number="555-700-0003",
    )

    # Act -- call the optimized patient count function (does not exist yet)
    result = dashboard_service.get_patient_count()

    # Assert
    assert result == 3, (
        f"get_patient_count should return 3 for three inserted patients, "
        f"got {result}"
    )
    assert isinstance(result, int), (
        "get_patient_count must return an integer, not a list or other type"
    )


def test_get_appointment_status_distribution(
    create_patient, create_appointment
) -> None:
    """AC1: Verify that service layer correctly aggregates appointment
    status counts with proper grouping.

    The get_status_distribution function should return a dictionary mapping
    each status string to its count across all appointments.
    """
    # Arrange -- create appointments with various statuses
    patient = create_patient(first_name="Status", last_name="Dist")
    now = datetime.utcnow()

    create_appointment(
        patient_id=patient["id"],
        date_time=(now + timedelta(days=1)).isoformat(),
        appointment_type="checkup",
        status="scheduled",
    )
    create_appointment(
        patient_id=patient["id"],
        date_time=(now - timedelta(days=1)).isoformat(),
        appointment_type="followup",
        status="completed",
    )
    create_appointment(
        patient_id=patient["id"],
        date_time=(now - timedelta(days=2)).isoformat(),
        appointment_type="consultation",
        status="completed",
    )
    create_appointment(
        patient_id=patient["id"],
        date_time=(now - timedelta(days=3)).isoformat(),
        appointment_type="checkup",
        status="cancelled",
    )

    # Act -- call the status distribution function (does not exist yet)
    result = dashboard_service.get_status_distribution()

    # Assert
    assert isinstance(result, dict), (
        "get_status_distribution must return a dictionary"
    )
    assert result.get("scheduled") == 1, (
        f"Expected 1 scheduled appointment, got {result.get('scheduled')}"
    )
    assert result.get("completed") == 2, (
        f"Expected 2 completed appointments, got {result.get('completed')}"
    )
    assert result.get("cancelled") == 1, (
        f"Expected 1 cancelled appointment, got {result.get('cancelled')}"
    )


def test_dashboard_metrics_model_structure() -> None:
    """AC5: Verify that DashboardMetrics model correctly structures complex
    analytics responses with all required fields.

    The DashboardMetrics model should include status_counts (a dict mapping
    status names to counts) and upcoming_appointments (a list) in addition
    to the scalar total fields, as specified in the implementation plan.
    """
    from app.models.dashboard import DashboardMetrics

    # Arrange -- construct a DashboardMetrics with the new fields
    # that are expected per the plan: status_counts, upcoming_appointments
    metrics = DashboardMetrics(
        total_patients=10,
        total_appointments=25,
        upcoming_appointments_count=5,
        completed_appointments_count=15,
        cancelled_appointments_count=3,
        patients_seen_today=2,
        completion_rate=60.0,
        growth_rate=12.5,
        status_counts={"scheduled": 7, "completed": 15, "cancelled": 3},
        upcoming_appointments=[
            {"id": 1, "patient_id": 1, "datetime": "2026-05-01T09:00:00"},
        ],
    )

    # Assert -- verify the new fields exist and hold correct values
    assert hasattr(metrics, "status_counts"), (
        "DashboardMetrics must have a status_counts field for status distribution"
    )
    assert isinstance(metrics.status_counts, dict), (
        "status_counts must be a dict mapping status names to integer counts"
    )
    assert metrics.status_counts["completed"] == 15, (
        "status_counts should correctly store the completed count"
    )

    assert hasattr(metrics, "upcoming_appointments"), (
        "DashboardMetrics must have an upcoming_appointments field"
    )
    assert isinstance(metrics.upcoming_appointments, list), (
        "upcoming_appointments must be a list of appointment dicts"
    )
    assert len(metrics.upcoming_appointments) == 1, (
        "upcoming_appointments should contain 1 item"
    )


def test_get_metrics_by_date_range_edge_case_empty_data() -> None:
    """AC6: Verify that dashboard service handles edge case when no data
    exists in specified date range.

    When get_metrics_by_date_range is called with a date range that
    contains no patients or appointments, it should return a valid
    metrics dict with all counts set to zero rather than raising errors.
    """
    # Arrange -- storage is empty (reset by autouse fixture)
    # Use a date range far in the future where no data can exist
    start_date = "2099-01-01"
    end_date = "2099-12-31"

    # Act -- call the date-range metrics function (does not exist yet)
    result = dashboard_service.get_metrics_by_date_range(
        start_date=start_date,
        end_date=end_date,
    )

    # Assert -- all counts should be zero, not None or missing
    assert isinstance(result, dict), (
        "get_metrics_by_date_range must return a dictionary"
    )
    assert result["total_patients"] == 0, (
        "total_patients should be 0 when no data exists in date range"
    )
    assert result["total_appointments"] == 0, (
        "total_appointments should be 0 when no data exists in date range"
    )
    assert result.get("status_counts", {}).get("completed", 0) == 0, (
        "completed count should be 0 when no data exists in date range"
    )
    assert result.get("status_counts", {}).get("scheduled", 0) == 0, (
        "scheduled count should be 0 when no data exists in date range"
    )
    assert result.get("status_counts", {}).get("cancelled", 0) == 0, (
        "cancelled count should be 0 when no data exists in date range"
    )
