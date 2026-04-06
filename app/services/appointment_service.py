"""Service layer for appointment business logic."""

import uuid
from datetime import datetime, timedelta

from app.models.appointment import AppointmentCreate, AppointmentUpdate
from app.storage import appointments_db, patients_db


def patient_exists(patient_id: int) -> bool:
    """Check whether a patient exists in storage."""
    return patient_id in patients_db


def has_scheduling_conflict(
    patient_id: int,
    date_time: datetime,
    duration_minutes: int,
    exclude_appointment_id: str | None = None,
) -> bool:
    """Check whether a new appointment would overlap with an existing one
    for the same patient. Cancelled appointments are ignored."""
    new_start = date_time
    new_end = date_time + timedelta(minutes=duration_minutes)
    for appt_id, appt in appointments_db.items():
        if exclude_appointment_id and appt_id == exclude_appointment_id:
            continue
        if appt.get("patient_id") != patient_id:
            continue
        status = appt.get("status")
        if hasattr(status, "value"):
            status = status.value
        if status == "cancelled":
            continue
        existing_start = appt.get("date_time")
        if isinstance(existing_start, str):
            existing_start = datetime.fromisoformat(existing_start)
        existing_duration = appt.get("duration_minutes", 30)
        existing_end = existing_start + timedelta(minutes=existing_duration)
        if new_start < existing_end and existing_start < new_end:
            return True
    return False


def create_appointment(data: AppointmentCreate) -> dict:
    """Create a new appointment, store in memory, and return the full record."""
    appointment_id = str(uuid.uuid4())
    now = datetime.utcnow()
    appointment = {
        "id": appointment_id,
        **data.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    appointments_db[appointment_id] = appointment
    return appointment


def get_appointment(appointment_id: str) -> dict | None:
    """Return an appointment dict by id, or None if not found."""
    return appointments_db.get(appointment_id)


def get_appointment_with_patient(appointment_id: str) -> dict | None:
    """Return an appointment dict merged with its patient data (JOIN).

    Returns None if the appointment does not exist.
    """
    appointment = appointments_db.get(appointment_id)
    if appointment is None:
        return None
    result = dict(appointment)
    patient = patients_db.get(appointment.get("patient_id"))
    if patient is not None:
        result["patient"] = dict(patient)
        for key, value in patient.items():
            if key not in result:
                result[key] = value
    return result


def get_all_appointments(patient_id: int | None = None) -> list[dict]:
    """Return all appointments, optionally filtered by patient_id."""
    appointments = list(appointments_db.values())
    if patient_id is not None:
        appointments = [
            a for a in appointments if a.get("patient_id") == patient_id
        ]
    return appointments


def update_appointment(
    appointment_id: str, data: AppointmentUpdate
) -> dict | None:
    """Partially update an appointment. Returns updated dict or None."""
    appointment = appointments_db.get(appointment_id)
    if appointment is None:
        return None
    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        appointment[key] = value
    now = datetime.utcnow()
    if appointment.get("updated_at") and now <= appointment["updated_at"]:
        now = appointment["updated_at"] + timedelta(microseconds=1)
    appointment["updated_at"] = now
    return appointment


def delete_appointment(appointment_id: str) -> bool:
    """Remove an appointment. Returns True if deleted, False if not found."""
    return appointments_db.pop(appointment_id, None) is not None
