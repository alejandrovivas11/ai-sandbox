"""Unit tests for the dashboard service layer.

These tests verify the get_dashboard_stats function directly,
independent of the HTTP routing layer. They import DashboardStats
from app.models.dashboard and call get_dashboard_stats() from
app.services.dashboard_service.

All tests clear storage before running via the autouse fixture in conftest.
"""

import datetime

from app import storage
from app.models.dashboard import DashboardStats
from app.services.dashboard_service import get_dashboard_stats


# ---------- Empty state ----------


def test_dashboard_service_empty_database() -> None:
    """get_dashboard_stats() returns DashboardStats with all counts as 0
    and empty lists when storage is cleared."""
    # Arrange -- storage is empty via autouse fixture

    # Act
    result = get_dashboard_stats()

    # Assert
    assert isinstance(result, DashboardStats), (
        f"Expected DashboardStats instance, got {type(result).__name__}"
    )
    assert result.total_patients == 0, (
        f"Expected total_patients=0, got {result.total_patients}"
    )
    assert result.total_appointments == 0, (
        f"Expected total_appointments=0, got {result.total_appointments}"
    )
    assert result.upcoming_appointments == 0, (
        f"Expected upcoming_appointments=0, got {result.upcoming_appointments}"
    )
    assert result.completed_appointments == 0, (
        f"Expected completed_appointments=0, got {result.completed_appointments}"
    )
    assert result.cancelled_appointments == 0, (
        f"Expected cancelled_appointments=0, got {result.cancelled_appointments}"
    )
    assert result.recent_appointments == [], (
        f"Expected recent_appointments=[], got {result.recent_appointments}"
    )
    assert result.today_appointments == [], (
        f"Expected today_appointments=[], got {result.today_appointments}"
    )


# ---------- Aggregation with known dataset ----------


def test_dashboard_service_aggregation_logic_with_known_dataset() -> None:
    """get_dashboard_stats() returns correct aggregated values when storage
    is seeded with a known dataset of 3 patients and 5 appointments with
    mixed statuses and dates."""
    # Arrange
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    yesterday_str = (
        datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ).strftime("%Y-%m-%d")

    storage.patients_db["p1"] = {"id": "p1", "first_name": "Alice"}
    storage.patients_db["p2"] = {"id": "p2", "first_name": "Bob"}
    storage.patients_db["p3"] = {"id": "p3", "first_name": "Charlie"}

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": "p1",
        "status": "scheduled",
        "date": today_str,
        "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": "p1",
        "status": "completed",
        "date": today_str,
        "created_at": "2023-12-01T11:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3",
        "patient_id": "p2",
        "status": "cancelled",
        "date": yesterday_str,
        "created_at": "2023-12-01T09:00:00",
    }
    storage.appointments_db["a4"] = {
        "id": "a4",
        "patient_id": "p2",
        "status": "scheduled",
        "date": yesterday_str,
        "created_at": "2023-12-01T08:00:00",
    }
    storage.appointments_db["a5"] = {
        "id": "a5",
        "patient_id": "p3",
        "status": "completed",
        "date": yesterday_str,
        "created_at": "2023-12-01T07:00:00",
    }

    # Act
    result = get_dashboard_stats()

    # Assert
    assert isinstance(result, DashboardStats), (
        f"Expected DashboardStats instance, got {type(result).__name__}"
    )
    assert result.total_patients == 3, (
        f"Expected total_patients=3, got {result.total_patients}"
    )
    assert result.total_appointments == 5, (
        f"Expected total_appointments=5, got {result.total_appointments}"
    )
    assert result.upcoming_appointments == 2, (
        f"Expected upcoming_appointments=2 (scheduled), got {result.upcoming_appointments}"
    )
    assert result.completed_appointments == 2, (
        f"Expected completed_appointments=2, got {result.completed_appointments}"
    )
    assert result.cancelled_appointments == 1, (
        f"Expected cancelled_appointments=1, got {result.cancelled_appointments}"
    )
    assert len(result.recent_appointments) <= 5, (
        f"Expected at most 5 recent_appointments, got {len(result.recent_appointments)}"
    )
    # today_appointments should only include appointments with today's date
    today_ids = {appt["id"] for appt in result.today_appointments}
    assert today_ids == {"a1", "a2"}, (
        f"Expected today_appointments to contain a1 and a2, got {today_ids}"
    )


# ---------- Datetime object handling ----------


def test_dashboard_service_handles_datetime_objects() -> None:
    """get_dashboard_stats() correctly handles appointments with datetime
    objects for created_at and date fields."""
    # Arrange
    now = datetime.datetime.utcnow()
    today_dt = now.replace(hour=10, minute=0, second=0, microsecond=0)

    storage.patients_db["p1"] = {"id": "p1", "first_name": "Alice"}

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": "p1",
        "status": "scheduled",
        "date": today_dt,
        "created_at": today_dt,
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": "p1",
        "status": "completed",
        "date": today_dt - datetime.timedelta(days=1),
        "created_at": today_dt - datetime.timedelta(hours=2),
    }

    # Act
    result = get_dashboard_stats()

    # Assert
    assert isinstance(result, DashboardStats), (
        f"Expected DashboardStats instance, got {type(result).__name__}"
    )
    assert result.total_patients == 1, (
        f"Expected total_patients=1, got {result.total_patients}"
    )
    assert result.total_appointments == 2, (
        f"Expected total_appointments=2, got {result.total_appointments}"
    )
    # a1 is scheduled (today), a2 is completed (yesterday)
    assert result.upcoming_appointments == 1, (
        f"Expected upcoming_appointments=1, got {result.upcoming_appointments}"
    )
    assert result.completed_appointments == 1, (
        f"Expected completed_appointments=1, got {result.completed_appointments}"
    )
    assert len(result.recent_appointments) == 2, (
        f"Expected 2 recent_appointments, got {len(result.recent_appointments)}"
    )
    # Only a1 is for today
    today_ids = {appt["id"] for appt in result.today_appointments}
    assert "a1" in today_ids, (
        "Expected appointment a1 (today) in today_appointments"
    )
    assert "a2" not in today_ids, (
        "Expected appointment a2 (yesterday) not in today_appointments"
    )


# ---------- ISO format string handling ----------


def test_dashboard_service_handles_iso_format_strings() -> None:
    """get_dashboard_stats() correctly handles appointments with ISO format
    strings for created_at and date fields."""
    # Arrange
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    yesterday_str = (
        datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ).strftime("%Y-%m-%d")

    storage.patients_db["p1"] = {"id": "p1", "first_name": "Alice"}

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": "p1",
        "status": "scheduled",
        "date": f"{today_str}T14:00:00",
        "created_at": f"{today_str}T14:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": "p1",
        "status": "cancelled",
        "date": f"{yesterday_str}T09:00:00",
        "created_at": f"{yesterday_str}T09:00:00",
    }

    # Act
    result = get_dashboard_stats()

    # Assert
    assert isinstance(result, DashboardStats), (
        f"Expected DashboardStats instance, got {type(result).__name__}"
    )
    assert result.total_appointments == 2, (
        f"Expected total_appointments=2, got {result.total_appointments}"
    )
    assert result.upcoming_appointments == 1, (
        f"Expected upcoming_appointments=1, got {result.upcoming_appointments}"
    )
    assert result.cancelled_appointments == 1, (
        f"Expected cancelled_appointments=1, got {result.cancelled_appointments}"
    )
    # Only a1 has today's date
    today_ids = {appt["id"] for appt in result.today_appointments}
    assert today_ids == {"a1"}, (
        f"Expected today_appointments to contain only a1, got {today_ids}"
    )
