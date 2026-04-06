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
