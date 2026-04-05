"""Integration tests for the GET /dashboard/ endpoint.

These tests exercise the dashboard route through the FastAPI TestClient,
verifying that aggregated metrics are correctly computed from the
in-memory patients and appointments data stores.
"""

from datetime import datetime, timedelta
from enum import Enum

from fastapi.testclient import TestClient

from app import storage


# ---------------------------------------------------------------------------
# Helper: a minimal AppointmentStatus-like enum so we can test that the
# service handles both enum and plain-string status values.
# ---------------------------------------------------------------------------
class _FakeStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


def _make_appointment(
    appt_id: str,
    patient_id: str,
    date_time: datetime | str,
    status: str | _FakeStatus,
) -> dict:
    """Return a minimal appointment dict suitable for storage insertion."""
    return {
        "id": appt_id,
        "patient_id": patient_id,
        "date_time": date_time,
        "status": status,
    }


def _make_patient(patient_id: str) -> dict:
    """Return a minimal patient dict suitable for storage insertion."""
    now = datetime.utcnow()
    return {
        "id": patient_id,
        "first_name": "Test",
        "last_name": "User",
        "date_of_birth": "1990-01-01",
        "gender": "other",
        "phone_number": "555-0100",
        "email": None,
        "address": None,
        "created_at": now,
        "updated_at": now,
    }


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


def test_dashboard_empty_state(client: TestClient) -> None:
    """GET /dashboard/ returns 200 with all six metric fields as integers
    set to zero when no data exists in storage."""
    # Arrange -- storage is already empty via autouse fixture

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK for empty dashboard, got {response.status_code}"
    )
    data = response.json()
    expected_keys = [
        "total_patients",
        "total_appointments",
        "upcoming_appointments_count",
        "completed_appointments_count",
        "cancelled_appointments_count",
        "patients_seen_today",
    ]
    for key in expected_keys:
        assert key in data, f"Response missing required key '{key}'"
        assert data[key] == 0, (
            f"Expected {key}=0 for empty state, got {data[key]}"
        )
        assert isinstance(data[key], int), (
            f"Expected {key} to be int, got {type(data[key]).__name__}"
        )


def test_dashboard_total_patients_count(client: TestClient) -> None:
    """Verify total_patients correctly reflects the count of items in
    storage.patients_db dictionary."""
    # Arrange
    for i in range(3):
        pid = f"pat-{i}"
        storage.patients_db[pid] = _make_patient(pid)

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["total_patients"] == 3, (
        f"Expected total_patients=3, got {data['total_patients']}"
    )


def test_dashboard_total_appointments_count(client: TestClient) -> None:
    """Verify total_appointments correctly reflects the count of items in
    storage.appointments_db dictionary."""
    # Arrange
    now = datetime.utcnow()
    for i in range(5):
        aid = f"appt-{i}"
        storage.appointments_db[aid] = _make_appointment(
            aid, f"pat-{i}", now + timedelta(days=i + 1), "scheduled"
        )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["total_appointments"] == 5, (
        f"Expected total_appointments=5, got {data['total_appointments']}"
    )


def test_dashboard_upcoming_appointments_future_only(client: TestClient) -> None:
    """Verify upcoming_appointments_count counts only appointments with
    date_time strictly in the future, excluding past appointments."""
    # Arrange
    now = datetime.utcnow()
    future_1 = _make_appointment(
        "a1", "p1", now + timedelta(hours=2), "scheduled"
    )
    future_2 = _make_appointment(
        "a2", "p2", now + timedelta(days=3), "scheduled"
    )
    past = _make_appointment(
        "a3", "p3", now - timedelta(days=1), "scheduled"
    )
    storage.appointments_db["a1"] = future_1
    storage.appointments_db["a2"] = future_2
    storage.appointments_db["a3"] = past

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["upcoming_appointments_count"] == 2, (
        f"Expected upcoming_appointments_count=2, got {data['upcoming_appointments_count']}"
    )


def test_dashboard_completed_appointments_status_filter(client: TestClient) -> None:
    """Verify completed_appointments_count correctly filters by completed
    status, handling both enum and string status values."""
    # Arrange
    now = datetime.utcnow()
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", now - timedelta(hours=1), "completed"
    )
    storage.appointments_db["a2"] = _make_appointment(
        "a2", "p2", now - timedelta(hours=2), "completed"
    )
    storage.appointments_db["a3"] = _make_appointment(
        "a3", "p3", now + timedelta(hours=1), "scheduled"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["completed_appointments_count"] == 2, (
        f"Expected completed_appointments_count=2, got {data['completed_appointments_count']}"
    )


def test_dashboard_cancelled_appointments_status_filter(client: TestClient) -> None:
    """Verify cancelled_appointments_count correctly filters by cancelled
    status, handling both enum and string status values."""
    # Arrange
    now = datetime.utcnow()
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", now, "cancelled"
    )
    storage.appointments_db["a2"] = _make_appointment(
        "a2", "p2", now + timedelta(hours=1), "scheduled"
    )
    storage.appointments_db["a3"] = _make_appointment(
        "a3", "p3", now - timedelta(hours=1), "scheduled"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["cancelled_appointments_count"] == 1, (
        f"Expected cancelled_appointments_count=1, got {data['cancelled_appointments_count']}"
    )


def test_dashboard_patients_seen_today_single_patient(client: TestClient) -> None:
    """Verify patients_seen_today counts unique patient_ids with completed
    appointments where date_time is today."""
    # Arrange
    today = datetime.utcnow().replace(hour=10, minute=0, second=0, microsecond=0)
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", today, "completed"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 1, (
        f"Expected patients_seen_today=1, got {data['patients_seen_today']}"
    )


def test_dashboard_patients_seen_today_deduplication(client: TestClient) -> None:
    """Verify patients_seen_today deduplicates by patient_id when same
    patient has multiple completed appointments today."""
    # Arrange -- two completed appointments today for the SAME patient
    today_morning = datetime.utcnow().replace(
        hour=9, minute=0, second=0, microsecond=0
    )
    today_afternoon = datetime.utcnow().replace(
        hour=14, minute=0, second=0, microsecond=0
    )
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", today_morning, "completed"
    )
    storage.appointments_db["a2"] = _make_appointment(
        "a2", "p1", today_afternoon, "completed"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 1, (
        f"Expected patients_seen_today=1 after dedup, got {data['patients_seen_today']}"
    )


def test_dashboard_scheduled_today_not_counted_as_seen(client: TestClient) -> None:
    """Verify patients_seen_today does not count scheduled (non-completed)
    appointments for today -- only completed ones."""
    # Arrange
    today = datetime.utcnow().replace(hour=11, minute=0, second=0, microsecond=0)
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", today, "scheduled"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 0, (
        f"Expected patients_seen_today=0 for scheduled-only, got {data['patients_seen_today']}"
    )


def test_dashboard_datetime_string_handling(client: TestClient) -> None:
    """Verify the service correctly handles appointment date_time stored as
    an ISO-format string instead of a datetime object."""
    # Arrange -- store date_time as an ISO string, not a datetime object
    tomorrow_str = (datetime.utcnow() + timedelta(days=1)).isoformat()
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", tomorrow_str, "scheduled"
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["upcoming_appointments_count"] == 1, (
        "Appointment with ISO-string date_time in the future should be counted "
        f"as upcoming, got upcoming_appointments_count={data['upcoming_appointments_count']}"
    )
    assert data["total_appointments"] == 1, (
        f"Expected total_appointments=1, got {data['total_appointments']}"
    )


def test_dashboard_status_enum_and_string_handling(client: TestClient) -> None:
    """Verify the service correctly handles appointment status stored as
    both an enum member and a plain string."""
    # Arrange -- one appointment with string status, one with enum status
    now = datetime.utcnow()
    storage.appointments_db["a1"] = _make_appointment(
        "a1", "p1", now - timedelta(hours=1), "completed"
    )
    storage.appointments_db["a2"] = _make_appointment(
        "a2", "p2", now - timedelta(hours=2), _FakeStatus.COMPLETED
    )

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["completed_appointments_count"] == 2, (
        "Both string and enum statuses should be counted as completed, "
        f"got completed_appointments_count={data['completed_appointments_count']}"
    )
