"""Comprehensive API-level integration tests for GET /dashboard/.

These tests use FastAPI TestClient to verify the dashboard endpoint returns
the correct DashboardStats schema with fields: total_patients,
total_appointments, upcoming_appointments, completed_appointments,
cancelled_appointments, recent_appointments, today_appointments.

All tests clear storage before running via the autouse fixture in conftest.
"""

import datetime

from fastapi.testclient import TestClient

from app import storage


DASHBOARD_STATS_KEYS = [
    "total_patients",
    "total_appointments",
    "upcoming_appointments",
    "completed_appointments",
    "cancelled_appointments",
    "recent_appointments",
    "today_appointments",
]


# ---------- Basic response ----------


def test_get_dashboard_stats_returns_200(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ returns HTTP 200 with JSON body containing all
    DashboardStats fields when storage has data."""
    # Arrange
    create_patient(first_name="Alice")
    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": "p1",
        "status": "scheduled",
        "date": datetime.datetime.utcnow().strftime("%Y-%m-%d"),
        "created_at": "2023-12-01T10:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200, (
        f"Expected HTTP 200, got {response.status_code}"
    )
    data = response.json()
    for key in DASHBOARD_STATS_KEYS:
        assert key in data, (
            f"Response missing required DashboardStats key '{key}'"
        )


def test_get_dashboard_stats_empty_storage(client: TestClient) -> None:
    """GET /dashboard/ returns HTTP 200 with all count fields as 0 and list
    fields as empty arrays when storage is empty."""
    # Arrange -- storage is empty via autouse fixture

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200, (
        f"Expected HTTP 200 for empty storage, got {response.status_code}"
    )
    data = response.json()
    assert data["total_patients"] == 0, (
        f"Expected total_patients=0, got {data['total_patients']}"
    )
    assert data["total_appointments"] == 0, (
        f"Expected total_appointments=0, got {data['total_appointments']}"
    )
    assert data["upcoming_appointments"] == 0, (
        f"Expected upcoming_appointments=0, got {data['upcoming_appointments']}"
    )
    assert data["completed_appointments"] == 0, (
        f"Expected completed_appointments=0, got {data['completed_appointments']}"
    )
    assert data["cancelled_appointments"] == 0, (
        f"Expected cancelled_appointments=0, got {data['cancelled_appointments']}"
    )
    assert data["recent_appointments"] == [], (
        f"Expected recent_appointments=[], got {data['recent_appointments']}"
    )
    assert data["today_appointments"] == [], (
        f"Expected today_appointments=[], got {data['today_appointments']}"
    )


# ---------- Patient counts ----------


def test_dashboard_counts_total_patients_correctly(
    client: TestClient, create_patient
) -> None:
    """total_patients field accurately reflects the number of patients in
    storage when 3 patients are seeded."""
    # Arrange
    create_patient(first_name="Alice")
    create_patient(first_name="Bob")
    create_patient(first_name="Charlie")

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["total_patients"] == 3, (
        f"Expected total_patients=3, got {data['total_patients']}"
    )


# ---------- Appointment counts ----------


def test_dashboard_counts_total_appointments_correctly(
    client: TestClient, create_patient
) -> None:
    """total_appointments field accurately reflects the number of appointments
    in storage when 5 appointments are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    for i in range(1, 6):
        storage.appointments_db[f"a{i}"] = {
            "id": f"a{i}",
            "patient_id": pid,
            "status": "scheduled",
            "date": today_str,
            "created_at": f"2023-12-01T{i + 10:02d}:00:00",
        }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["total_appointments"] == 5, (
        f"Expected total_appointments=5, got {data['total_appointments']}"
    )


# ---------- Status-based counts ----------


def test_dashboard_counts_appointments_by_status_scheduled(
    client: TestClient, create_patient
) -> None:
    """upcoming_appointments counts only appointments with status 'scheduled'
    when mixed status appointments are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T11:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3", "patient_id": pid, "status": "completed",
        "date": today_str, "created_at": "2023-12-01T12:00:00",
    }
    storage.appointments_db["a4"] = {
        "id": "a4", "patient_id": pid, "status": "cancelled",
        "date": today_str, "created_at": "2023-12-01T13:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["upcoming_appointments"] == 2, (
        f"Expected upcoming_appointments=2, got {data['upcoming_appointments']}"
    )


def test_dashboard_counts_appointments_by_status_completed(
    client: TestClient, create_patient
) -> None:
    """completed_appointments counts only appointments with status 'completed'
    when mixed status appointments are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2", "patient_id": pid, "status": "completed",
        "date": today_str, "created_at": "2023-12-01T11:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3", "patient_id": pid, "status": "completed",
        "date": today_str, "created_at": "2023-12-01T12:00:00",
    }
    storage.appointments_db["a4"] = {
        "id": "a4", "patient_id": pid, "status": "cancelled",
        "date": today_str, "created_at": "2023-12-01T13:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["completed_appointments"] == 2, (
        f"Expected completed_appointments=2, got {data['completed_appointments']}"
    )


def test_dashboard_counts_appointments_by_status_cancelled(
    client: TestClient, create_patient
) -> None:
    """cancelled_appointments counts only appointments with status 'cancelled'
    when mixed status appointments are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2", "patient_id": pid, "status": "completed",
        "date": today_str, "created_at": "2023-12-01T11:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3", "patient_id": pid, "status": "cancelled",
        "date": today_str, "created_at": "2023-12-01T12:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["cancelled_appointments"] == 1, (
        f"Expected cancelled_appointments=1, got {data['cancelled_appointments']}"
    )


# ---------- Recent appointments ----------


def test_dashboard_recent_appointments_limited_to_5(
    client: TestClient, create_patient
) -> None:
    """recent_appointments returns exactly 5 appointments when 7 appointments
    with distinct created_at timestamps are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    for i in range(1, 8):
        storage.appointments_db[f"a{i}"] = {
            "id": f"a{i}",
            "patient_id": pid,
            "status": "scheduled",
            "date": today_str,
            "created_at": f"2023-12-01T{i + 10:02d}:00:00",
        }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data["recent_appointments"]) == 5, (
        f"Expected exactly 5 recent_appointments, got {len(data['recent_appointments'])}"
    )


def test_dashboard_recent_appointments_ordered_by_created_at_desc(
    client: TestClient, create_patient
) -> None:
    """recent_appointments are ordered by created_at in descending order
    when appointments with different timestamps are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T08:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T14:00:00",
    }
    storage.appointments_db["a3"] = {
        "id": "a3", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T10:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    recent = data["recent_appointments"]
    assert len(recent) == 3, (
        f"Expected 3 recent_appointments, got {len(recent)}"
    )
    assert recent[0]["id"] == "a2", (
        f"Expected most recent appointment (a2) first, got {recent[0]['id']}"
    )
    assert recent[1]["id"] == "a3", (
        f"Expected second most recent (a3) second, got {recent[1]['id']}"
    )
    assert recent[2]["id"] == "a1", (
        f"Expected oldest appointment (a1) last, got {recent[2]['id']}"
    )


def test_dashboard_recent_appointments_less_than_5(
    client: TestClient, create_patient
) -> None:
    """recent_appointments returns all appointments when fewer than 5
    appointments exist in storage."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1", "patient_id": pid, "status": "scheduled",
        "date": today_str, "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2", "patient_id": pid, "status": "completed",
        "date": today_str, "created_at": "2023-12-01T11:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data["recent_appointments"]) == 2, (
        f"Expected 2 recent_appointments, got {len(data['recent_appointments'])}"
    )


# ---------- Today appointments ----------


def test_dashboard_today_appointments_filters_by_date(
    client: TestClient, create_patient
) -> None:
    """today_appointments contains only appointments whose date matches
    today's date when appointments for today and yesterday are seeded."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    yesterday_str = (
        datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ).strftime("%Y-%m-%d")

    storage.appointments_db["a_today_1"] = {
        "id": "a_today_1",
        "patient_id": pid,
        "status": "scheduled",
        "date": today_str,
        "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a_today_2"] = {
        "id": "a_today_2",
        "patient_id": pid,
        "status": "completed",
        "date": today_str,
        "created_at": "2023-12-01T11:00:00",
    }
    storage.appointments_db["a_yesterday"] = {
        "id": "a_yesterday",
        "patient_id": pid,
        "status": "scheduled",
        "date": yesterday_str,
        "created_at": "2023-12-01T09:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    today_appts = data["today_appointments"]
    today_ids = {appt["id"] for appt in today_appts}
    assert len(today_appts) == 2, (
        f"Expected 2 today_appointments, got {len(today_appts)}"
    )
    assert today_ids == {"a_today_1", "a_today_2"}, (
        f"Expected today appointments a_today_1 and a_today_2, got {today_ids}"
    )


def test_dashboard_today_appointments_empty_when_no_today_appointments(
    client: TestClient, create_patient
) -> None:
    """today_appointments returns empty list when no appointments are
    scheduled for today."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    yesterday_str = (
        datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ).strftime("%Y-%m-%d")

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": pid,
        "status": "scheduled",
        "date": yesterday_str,
        "created_at": "2023-12-01T10:00:00",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": pid,
        "status": "completed",
        "date": yesterday_str,
        "created_at": "2023-12-01T11:00:00",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["today_appointments"] == [], (
        f"Expected empty today_appointments, got {data['today_appointments']}"
    )
