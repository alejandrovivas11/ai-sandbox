"""Unit tests for storage-layer helper functions.

These tests verify the new storage methods: count_patients,
count_appointments, count_appointments_by_status,
get_recent_appointments, and get_appointments_today.

All tests clear storage before running via the autouse fixture in conftest.
"""

import datetime

from app import storage
from app.storage import (
    count_appointments,
    count_appointments_by_status,
    count_patients,
    get_appointments_today,
    get_recent_appointments,
)


# ---------- count_patients ----------


def test_count_patients_empty_storage() -> None:
    """count_patients() returns 0 when no patients exist in storage."""
    # Arrange -- storage is empty via autouse fixture

    # Act
    result = count_patients()

    # Assert
    assert result == 0, (
        f"Expected count_patients() to return 0 for empty storage, got {result}"
    )


def test_count_patients_with_data() -> None:
    """count_patients() returns correct count when 3 patients are added."""
    # Arrange
    storage.patients_db["p1"] = {"id": "p1", "first_name": "Alice"}
    storage.patients_db["p2"] = {"id": "p2", "first_name": "Bob"}
    storage.patients_db["p3"] = {"id": "p3", "first_name": "Charlie"}

    # Act
    result = count_patients()

    # Assert
    assert result == 3, (
        f"Expected count_patients() to return 3, got {result}"
    )


# ---------- count_appointments ----------


def test_count_appointments_empty_storage() -> None:
    """count_appointments() returns 0 when no appointments exist in storage."""
    # Arrange -- storage is empty via autouse fixture

    # Act
    result = count_appointments()

    # Assert
    assert result == 0, (
        f"Expected count_appointments() to return 0 for empty storage, got {result}"
    )


def test_count_appointments_with_data() -> None:
    """count_appointments() returns correct count when 5 appointments are added."""
    # Arrange
    for i in range(1, 6):
        storage.appointments_db[f"a{i}"] = {
            "id": f"a{i}",
            "patient_id": "p1",
            "status": "scheduled",
            "date": "2023-12-01",
            "created_at": f"2023-12-01T0{i}:00:00",
        }

    # Act
    result = count_appointments()

    # Assert
    assert result == 5, (
        f"Expected count_appointments() to return 5, got {result}"
    )


# ---------- count_appointments_by_status ----------


def test_count_appointments_by_status_scheduled() -> None:
    """count_appointments_by_status('scheduled') returns correct count
    when appointments with mixed statuses exist."""
    # Arrange
    storage.appointments_db["a1"] = {"id": "a1", "status": "scheduled"}
    storage.appointments_db["a2"] = {"id": "a2", "status": "scheduled"}
    storage.appointments_db["a3"] = {"id": "a3", "status": "completed"}
    storage.appointments_db["a4"] = {"id": "a4", "status": "cancelled"}

    # Act
    result = count_appointments_by_status("scheduled")

    # Assert
    assert result == 2, (
        f"Expected count_appointments_by_status('scheduled') to return 2, got {result}"
    )


def test_count_appointments_by_status_nonexistent_status() -> None:
    """count_appointments_by_status('nonexistent') returns 0 when no
    appointments have that status."""
    # Arrange
    storage.appointments_db["a1"] = {"id": "a1", "status": "scheduled"}
    storage.appointments_db["a2"] = {"id": "a2", "status": "completed"}

    # Act
    result = count_appointments_by_status("nonexistent")

    # Assert
    assert result == 0, (
        f"Expected count_appointments_by_status('nonexistent') to return 0, got {result}"
    )


# ---------- get_recent_appointments ----------


def test_get_recent_appointments_ordered_desc() -> None:
    """get_recent_appointments() returns appointments ordered by created_at
    in descending order when multiple appointments with different timestamps exist."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "created_at": "2023-12-01T08:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "created_at": "2023-12-01T12:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3",
        "created_at": "2023-12-01T10:00:00",
    }

    # Act
    result = get_recent_appointments(limit=5)

    # Assert
    assert len(result) == 3, (
        f"Expected 3 appointments, got {len(result)}"
    )
    assert result[0]["id"] == "a2", (
        f"Expected most recent appointment (a2) first, got {result[0]['id']}"
    )
    assert result[1]["id"] == "a3", (
        f"Expected second most recent (a3) second, got {result[1]['id']}"
    )
    assert result[2]["id"] == "a1", (
        f"Expected oldest appointment (a1) last, got {result[2]['id']}"
    )


def test_get_recent_appointments_respects_limit() -> None:
    """get_recent_appointments(limit=3) returns exactly 3 appointments
    when 5 appointments exist."""
    # Arrange
    for i in range(1, 6):
        storage.appointments_db[f"a{i}"] = {
            "id": f"a{i}",
            "created_at": f"2023-12-01T{i + 10:02d}:00:00",
        }

    # Act
    result = get_recent_appointments(limit=3)

    # Assert
    assert len(result) == 3, (
        f"Expected exactly 3 appointments when limit=3, got {len(result)}"
    )


def test_get_recent_appointments_handles_datetime_objects() -> None:
    """get_recent_appointments() correctly sorts appointments with datetime
    objects for the created_at field."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "created_at": datetime.datetime(2023, 12, 1, 8, 0, 0),
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "created_at": datetime.datetime(2023, 12, 1, 14, 0, 0),
    }
    storage.appointments_db["a3"] = {
        "id": "a3",
        "created_at": datetime.datetime(2023, 12, 1, 10, 0, 0),
    }

    # Act
    result = get_recent_appointments(limit=5)

    # Assert
    assert len(result) == 3, (
        f"Expected 3 appointments, got {len(result)}"
    )
    assert result[0]["id"] == "a2", (
        "Expected appointment with latest datetime (a2) first"
    )
    assert result[1]["id"] == "a3", (
        "Expected appointment with middle datetime (a3) second"
    )
    assert result[2]["id"] == "a1", (
        "Expected appointment with earliest datetime (a1) last"
    )


def test_get_recent_appointments_handles_iso_strings() -> None:
    """get_recent_appointments() correctly sorts appointments with ISO format
    strings for the created_at field."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "created_at": "2023-11-30T23:59:59",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "created_at": "2023-12-02T00:00:01",
    }

    # Act
    result = get_recent_appointments(limit=5)

    # Assert
    assert len(result) == 2, (
        f"Expected 2 appointments, got {len(result)}"
    )
    assert result[0]["id"] == "a2", (
        "Expected appointment with later ISO string (a2) first"
    )
    assert result[1]["id"] == "a1", (
        "Expected appointment with earlier ISO string (a1) last"
    )


# ---------- get_appointments_today ----------


def test_get_appointments_today_matches_date() -> None:
    """get_appointments_today('2023-12-01') returns only appointments
    with date matching '2023-12-01'."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "date": "2023-12-01",
        "status": "scheduled",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "date": "2023-12-02",
        "status": "scheduled",
    }
    storage.appointments_db["a3"] = {
        "id": "a3",
        "date": "2023-12-01",
        "status": "completed",
    }

    # Act
    result = get_appointments_today("2023-12-01")

    # Assert
    assert len(result) == 2, (
        f"Expected 2 appointments for 2023-12-01, got {len(result)}"
    )
    result_ids = {appt["id"] for appt in result}
    assert result_ids == {"a1", "a3"}, (
        f"Expected appointments a1 and a3, got {result_ids}"
    )


def test_get_appointments_today_empty_when_no_matches() -> None:
    """get_appointments_today() returns empty list when no appointments
    match the given date."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "date": "2023-12-01",
        "status": "scheduled",
    }

    # Act
    result = get_appointments_today("2023-12-25")

    # Assert
    assert result == [], (
        f"Expected empty list for non-matching date, got {result}"
    )


def test_get_appointments_today_handles_datetime_objects() -> None:
    """get_appointments_today() correctly filters appointments with
    datetime objects for the date field."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "date": datetime.datetime(2023, 12, 1, 10, 30, 0),
        "status": "scheduled",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "date": datetime.datetime(2023, 12, 2, 9, 0, 0),
        "status": "scheduled",
    }

    # Act
    result = get_appointments_today("2023-12-01")

    # Assert
    assert len(result) == 1, (
        f"Expected 1 appointment for 2023-12-01 with datetime objects, got {len(result)}"
    )
    assert result[0]["id"] == "a1", (
        f"Expected appointment a1, got {result[0]['id']}"
    )


def test_get_appointments_today_handles_iso_strings() -> None:
    """get_appointments_today() correctly filters appointments with
    ISO format strings for the date field."""
    # Arrange
    storage.appointments_db["a1"] = {
        "id": "a1",
        "date": "2023-12-01T10:30:00",
        "status": "scheduled",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "date": "2023-12-02T09:00:00",
        "status": "completed",
    }

    # Act
    result = get_appointments_today("2023-12-01")

    # Assert
    assert len(result) == 1, (
        f"Expected 1 appointment for 2023-12-01 with ISO strings, got {len(result)}"
    )
    assert result[0]["id"] == "a1", (
        f"Expected appointment a1, got {result[0]['id']}"
    )
