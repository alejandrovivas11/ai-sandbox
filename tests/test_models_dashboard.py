"""Unit tests for the DashboardMetrics Pydantic model.

These tests verify schema validation: required fields, correct types,
and rejection of invalid input.
"""

import pytest
from pydantic import ValidationError

from app.models.dashboard import DashboardMetrics


def test_dashboard_metrics_model_validation() -> None:
    """Verify DashboardMetrics model validates all six required integer
    fields without default values."""
    # Arrange
    payload = {
        "total_patients": 10,
        "total_appointments": 25,
        "upcoming_appointments_count": 5,
        "completed_appointments_count": 15,
        "cancelled_appointments_count": 3,
        "patients_seen_today": 7,
    }

    # Act
    metrics = DashboardMetrics(**payload)

    # Assert
    assert metrics.total_patients == 10, (
        f"Expected total_patients=10, got {metrics.total_patients}"
    )
    assert metrics.total_appointments == 25, (
        f"Expected total_appointments=25, got {metrics.total_appointments}"
    )
    assert metrics.upcoming_appointments_count == 5, (
        f"Expected upcoming_appointments_count=5, got {metrics.upcoming_appointments_count}"
    )
    assert metrics.completed_appointments_count == 15, (
        f"Expected completed_appointments_count=15, got {metrics.completed_appointments_count}"
    )
    assert metrics.cancelled_appointments_count == 3, (
        f"Expected cancelled_appointments_count=3, got {metrics.cancelled_appointments_count}"
    )
    assert metrics.patients_seen_today == 7, (
        f"Expected patients_seen_today=7, got {metrics.patients_seen_today}"
    )


def test_dashboard_metrics_model_invalid_types() -> None:
    """Verify DashboardMetrics model raises ValidationError when
    non-integer values are provided for metric fields."""
    # Arrange
    payload = {
        "total_patients": "not_a_number",
        "total_appointments": 25,
        "upcoming_appointments_count": 5,
        "completed_appointments_count": 15,
        "cancelled_appointments_count": 3,
        "patients_seen_today": 7,
    }

    # Act / Assert
    with pytest.raises(ValidationError) as exc_info:
        DashboardMetrics(**payload)

    assert exc_info.value.error_count() >= 1, (
        "Expected at least one validation error for non-integer field value"
    )
