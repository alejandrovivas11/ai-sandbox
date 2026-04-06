"""Unit tests for the appointment service layer.

Tests the service functions directly (bypassing the HTTP layer) to verify
SQLite-backed CRUD operations, parameterized queries, dict conversion,
and foreign key constraint handling.
"""

import pytest

from app import storage
from app.models.appointment import AppointmentCreate, AppointmentUpdate
from app.services.appointment_service import (
    create_appointment,
    delete_appointment,
    get_appointment,
    get_appointments,
    update_appointment,
)


# ---------------------------------------------------------------------------
# Foreign key constraint
# ---------------------------------------------------------------------------


def test_create_appointment_foreign_key_constraint() -> None:
    """create_appointment() raises ValueError with 'Patient not found'
    message when given a non-existent patient_id, enforcing the foreign
    key constraint at the service level.
    """
    # Arrange
    data = AppointmentCreate(
        patient_id="nonexistent-patient-id",
        doctor_name="Dr. Smith",
        datetime="2025-12-15T10:00:00",
    )

    # Act / Assert
    with pytest.raises(ValueError, match="Patient not found"):
        create_appointment(data)


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------


def test_create_appointment_returns_dict_with_all_fields() -> None:
    """create_appointment() returns a dict containing all expected fields
    including server-generated id, created_at, and updated_at.
    """
    # Arrange -- insert a patient directly into the database so the FK is valid
    conn = storage.get_connection()
    try:
        conn.execute(
            "INSERT INTO patients (id, first_name, last_name, date_of_birth, "
            "gender, phone_number, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                "test-patient-id", "Jane", "Doe", "1990-01-15",
                "female", "555-123-4567", "2025-01-01T00:00:00",
                "2025-01-01T00:00:00",
            ),
        )
        conn.commit()
    finally:
        conn.close()

    data = AppointmentCreate(
        patient_id="test-patient-id",
        doctor_name="Dr. Smith",
        datetime="2025-12-15T10:00:00",
    )

    # Act
    result = create_appointment(data)

    # Assert
    assert isinstance(result, dict), "create_appointment must return a dict"
    assert "id" in result, "Result must contain an id field"
    assert result["patient_id"] == "test-patient-id", (
        "Result patient_id must match input"
    )
    assert result["doctor_name"] == "Dr. Smith", (
        "Result doctor_name must match input"
    )
    assert result["status"] == "scheduled", (
        "Default status must be 'scheduled'"
    )
    assert "created_at" in result, "Result must contain created_at"
    assert "updated_at" in result, "Result must contain updated_at"


# ---------------------------------------------------------------------------
# Read
# ---------------------------------------------------------------------------


def test_get_appointments_returns_list() -> None:
    """get_appointments() returns a list of dicts (empty when no data)."""
    # Arrange -- nothing; database is clean

    # Act
    result = get_appointments()

    # Assert
    assert isinstance(result, list), "get_appointments must return a list"
    assert len(result) == 0, "List must be empty when no appointments exist"


def test_get_appointment_nonexistent_returns_none() -> None:
    """get_appointment() returns None for a non-existent appointment id."""
    # Arrange
    fake_id = "00000000-0000-0000-0000-000000000000"

    # Act
    result = get_appointment(fake_id)

    # Assert
    assert result is None, "get_appointment must return None for missing id"


# ---------------------------------------------------------------------------
# Update
# ---------------------------------------------------------------------------


def test_update_appointment_nonexistent_returns_none() -> None:
    """update_appointment() returns None for a non-existent appointment id."""
    # Arrange
    fake_id = "00000000-0000-0000-0000-000000000000"
    data = AppointmentUpdate(doctor_name="Dr. Johnson")

    # Act
    result = update_appointment(fake_id, data)

    # Assert
    assert result is None, (
        "update_appointment must return None for missing id"
    )


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------


def test_delete_appointment_nonexistent_returns_false() -> None:
    """delete_appointment() returns False for a non-existent appointment id."""
    # Arrange
    fake_id = "00000000-0000-0000-0000-000000000000"

    # Act
    result = delete_appointment(fake_id)

    # Assert
    assert result is False, (
        "delete_appointment must return False for missing id"
    )
