"""Comprehensive integration tests for the GET /dashboard/ endpoint.

Covers empty state, counts, upcoming/completed/cancelled metrics,
patients_seen_today with deduplication, and status filtering.
These tests use the API-level factory fixtures to create data through
the HTTP endpoints rather than inserting directly into storage.
"""

from datetime import datetime

from fastapi.testclient import TestClient

from app import storage


# ---------- Empty state ----------


def test_dashboard_empty(client: TestClient) -> None:
    """GET /dashboard/ with no data returns all 6 metric fields as 0."""
    # Arrange -- storage is already empty via autouse fixture

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
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


# ---------- Patients only ----------


def test_dashboard_patients_only(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ after creating 3 patients returns total_patients=3
    and all other metrics as 0."""
    # Arrange
    create_patient(first_name="Alice")
    create_patient(first_name="Bob")
    create_patient(first_name="Charlie")

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    data = response.json()
    assert data["total_patients"] == 3, (
        f"Expected total_patients=3, got {data['total_patients']}"
    )
    assert data["total_appointments"] == 0, (
        f"Expected total_appointments=0, got {data['total_appointments']}"
    )
    assert data["upcoming_appointments_count"] == 0, (
        f"Expected upcoming_appointments_count=0, got {data['upcoming_appointments_count']}"
    )
    assert data["completed_appointments_count"] == 0, (
        f"Expected completed_appointments_count=0, got {data['completed_appointments_count']}"
    )
    assert data["cancelled_appointments_count"] == 0, (
        f"Expected cancelled_appointments_count=0, got {data['cancelled_appointments_count']}"
    )
    assert data["patients_seen_today"] == 0, (
        f"Expected patients_seen_today=0, got {data['patients_seen_today']}"
    )


# ---------- Total counts ----------


def test_dashboard_total_counts(
    client: TestClient, create_patient, create_appointment
) -> None:
    """GET /dashboard/ with 2 patients and 3 appointments returns correct
    total_patients and total_appointments counts."""
    # Arrange
    p1 = create_patient(first_name="Alice")
    p2 = create_patient(first_name="Bob")
    create_appointment(patient_id=p1["id"])
    create_appointment(patient_id=p1["id"], date_time="2025-12-16T10:00:00")
    create_appointment(patient_id=p2["id"])

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["total_patients"] == 2, (
        f"Expected total_patients=2, got {data['total_patients']}"
    )
    assert data["total_appointments"] == 3, (
        f"Expected total_appointments=3, got {data['total_appointments']}"
    )


# ---------- Upcoming count ----------


def test_dashboard_upcoming_count(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ with 2 future appointments and 1 past appointment
    returns upcoming_appointments=2."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]

    # Insert appointments directly into storage to control date_time
    storage.appointments_db["future-1"] = {
        "id": "future-1",
        "patient_id": pid,
        "date_time": "2099-12-15T10:00:00",
        "status": "scheduled",
    }
    storage.appointments_db["future-2"] = {
        "id": "future-2",
        "patient_id": pid,
        "date_time": "2099-12-15T10:00:00",
        "status": "scheduled",
    }
    storage.appointments_db["past-1"] = {
        "id": "past-1",
        "patient_id": pid,
        "date_time": "2020-01-01T10:00:00",
        "status": "scheduled",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["upcoming_appointments_count"] == 2, (
        f"Expected upcoming_appointments_count=2, got {data['upcoming_appointments_count']}"
    )


# ---------- Completed and cancelled ----------


def test_dashboard_completed_and_cancelled(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ with 3 appointments having different statuses returns
    correct completed_appointments=1 and cancelled_appointments=1."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    now = datetime.utcnow()

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": pid,
        "date_time": now.isoformat(),
        "status": "scheduled",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": pid,
        "date_time": now.isoformat(),
        "status": "completed",
    }
    storage.appointments_db["a3"] = {
        "id": "a3",
        "patient_id": pid,
        "date_time": now.isoformat(),
        "status": "cancelled",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["completed_appointments_count"] == 1, (
        f"Expected completed_appointments_count=1, got {data['completed_appointments_count']}"
    )
    assert data["cancelled_appointments_count"] == 1, (
        f"Expected cancelled_appointments_count=1, got {data['cancelled_appointments_count']}"
    )


# ---------- Patients seen today ----------


def test_dashboard_patients_seen_today(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ with 1 completed appointment today returns
    patients_seen_today=1."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    now = datetime.utcnow()

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": pid,
        "date_time": now.isoformat(),
        "status": "completed",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 1, (
        f"Expected patients_seen_today=1, got {data['patients_seen_today']}"
    )


def test_dashboard_patients_seen_today_dedup(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ with the same patient having 2 completed appointments
    today returns patients_seen_today=1 (deduplicated)."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    now = datetime.utcnow()

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": pid,
        "date_time": now.replace(hour=9, minute=0).isoformat(),
        "status": "completed",
    }
    storage.appointments_db["a2"] = {
        "id": "a2",
        "patient_id": pid,
        "date_time": now.replace(hour=14, minute=0).isoformat(),
        "status": "completed",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 1, (
        f"Expected patients_seen_today=1 after dedup, got {data['patients_seen_today']}"
    )


def test_dashboard_scheduled_today_not_counted_as_seen(
    client: TestClient, create_patient
) -> None:
    """GET /dashboard/ with a scheduled (not completed) appointment today
    returns patients_seen_today=0."""
    # Arrange
    patient = create_patient()
    pid = patient["id"]
    now = datetime.utcnow()

    storage.appointments_db["a1"] = {
        "id": "a1",
        "patient_id": pid,
        "date_time": now.isoformat(),
        "status": "scheduled",
    }

    # Act
    response = client.get("/dashboard/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["patients_seen_today"] == 0, (
        f"Expected patients_seen_today=0 for scheduled-only, got {data['patients_seen_today']}"
    )
