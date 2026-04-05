"""Unit tests for the dashboard service layer.

These tests verify the get_dashboard_metrics function directly,
independent of the HTTP routing layer.
"""

from datetime import datetime, timedelta
from unittest.mock import patch

from app import storage
from app.services.dashboard_service import get_dashboard_metrics


def test_get_dashboard_metrics_returns_all_keys() -> None:
    """Verify get_dashboard_metrics returns a dict with all 6 required keys:
    total_patients, total_appointments, upcoming_appointments_count,
    completed_appointments_count, cancelled_appointments_count,
    patients_seen_today."""
    # Arrange -- empty storage (autouse fixture resets it)

    # Act
    result = get_dashboard_metrics()

    # Assert
    expected_keys = {
        "total_patients",
        "total_appointments",
        "upcoming_appointments_count",
        "completed_appointments_count",
        "cancelled_appointments_count",
        "patients_seen_today",
    }
    assert isinstance(result, dict), (
        f"Expected dict return type, got {type(result).__name__}"
    )
    assert set(result.keys()) == expected_keys, (
        f"Expected keys {expected_keys}, got {set(result.keys())}"
    )
    for key in expected_keys:
        assert isinstance(result[key], int), (
            f"Expected {key} to be int, got {type(result[key]).__name__}"
        )


def test_get_dashboard_metrics_single_iteration() -> None:
    """Verify get_dashboard_metrics computes all appointment-based metrics
    in a single iteration over appointments_db for efficiency.

    We patch appointments_db.values to track how many times it is called;
    it should be invoked exactly once regardless of the number of
    appointment-level metrics being computed.
    """
    # Arrange
    now = datetime.utcnow()
    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": "p1",
        "date_time": now + timedelta(hours=1),
        "status": "scheduled",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": "p2",
        "date_time": now - timedelta(hours=1),
        "status": "completed",
    }

    original_values = storage.appointments_db.values
    call_count = 0

    def tracking_values() -> list:
        nonlocal call_count
        call_count += 1
        return original_values()

    # Act
    with patch.object(
        type(storage.appointments_db), "values", tracking_values
    ):
        result = get_dashboard_metrics()

    # Assert
    assert call_count == 1, (
        f"appointments_db.values() should be called exactly once, was called {call_count} times"
    )
    # Sanity-check that results are still correct
    assert result["total_appointments"] == 2, (
        f"Expected total_appointments=2, got {result['total_appointments']}"
    )
