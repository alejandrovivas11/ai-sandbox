"""Service layer for appointment business logic."""

from datetime import datetime

from app.models.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    VALID_STATUS_TRANSITIONS,
)
from app.storage import get_storage


def patient_exists(patient_id: int) -> bool:
    """Check whether a patient exists in storage."""
    return get_storage().patient_exists(patient_id)


def validate_patient_exists(patient_id: int) -> bool:
    """Validate that a patient record exists for the given integer ID.

    Returns True when the patient exists, False otherwise.
    """
    return get_storage().patient_exists(patient_id)


def validate_scheduling_conflict(
    patient_id: int,
    date_time: datetime,
    duration_minutes: int,
    exclude_appointment_id: int | None = None,
) -> bool:
    """Return True if creating / updating an appointment would cause a
    scheduling conflict with an existing non-cancelled appointment."""
    dt_str = (
        date_time.isoformat() if isinstance(date_time, datetime) else date_time
    )
    return get_storage().has_scheduling_conflict(
        patient_id, dt_str, duration_minutes, exclude_appointment_id
    )


def has_scheduling_conflict(
    patient_id: int,
    date_time: datetime,
    duration_minutes: int,
    exclude_appointment_id: int | None = None,
) -> bool:
    """Check whether a new appointment would overlap with an existing one
    for the same patient.  Cancelled appointments are ignored."""
    dt_str = (
        date_time.isoformat() if isinstance(date_time, datetime) else date_time
    )
    return get_storage().has_scheduling_conflict(
        patient_id, dt_str, duration_minutes, exclude_appointment_id
    )


def create_appointment(data: AppointmentCreate) -> dict:
    """Create a new appointment, store it, and return the full record.

    Returns an integer appointment ID instead of a string UUID.
    """
    dump = data.model_dump()
    # Convert datetime to ISO string for SQL storage
    if isinstance(dump.get("datetime"), datetime):
        dump["datetime"] = dump["datetime"].isoformat()
    # Convert enum to plain string value
    if hasattr(dump.get("status"), "value"):
        dump["status"] = dump["status"].value
    return get_storage().insert_appointment(**dump)


def get_appointment(appointment_id: int) -> dict | None:
    """Return an appointment dict by integer id, or None if not found."""
    return get_storage().get_appointment(appointment_id)


def get_appointment_with_patient(appointment_id: int) -> dict | None:
    """Return an appointment dict merged with its patient data (JOIN).

    Returns None if the appointment does not exist.
    """
    return get_storage().get_appointment_with_patient(appointment_id)


def get_all_appointments(
    patient_id: int | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    status: str | None = None,
) -> list[dict]:
    """Return all appointments, with optional filters."""
    return get_storage().get_all_appointments(
        patient_id=patient_id,
        date_from=date_from,
        date_to=date_to,
        status=status,
    )


def update_appointment(
    appointment_id: int, data: AppointmentUpdate
) -> dict | None:
    """Partially update an appointment. Returns updated dict or None.

    Validates status transitions: completed and cancelled appointments
    cannot transition back to other states.
    """
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        return get_storage().get_appointment(appointment_id)

    # Validate status transition if status is being changed
    if "status" in updates:
        existing = get_storage().get_appointment(appointment_id)
        if existing is None:
            return None
        current_status = existing.get("status", "")
        if hasattr(current_status, "value"):
            current_status = current_status.value
        new_status = updates["status"]
        if hasattr(new_status, "value"):
            new_status = new_status.value
        if current_status != new_status:
            allowed = VALID_STATUS_TRANSITIONS.get(current_status, set())
            if new_status not in allowed:
                return None

    if "datetime" in updates and isinstance(updates["datetime"], datetime):
        updates["datetime"] = updates["datetime"].isoformat()
    if "status" in updates and hasattr(updates["status"], "value"):
        updates["status"] = updates["status"].value
    return get_storage().update_appointment(appointment_id, **updates)


def delete_appointment(appointment_id: int) -> bool:
    """Remove an appointment. Returns True if deleted, False if not found."""
    return get_storage().delete_appointment(appointment_id)
