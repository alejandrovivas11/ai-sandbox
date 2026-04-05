"""Service layer for appointment business logic."""

import uuid
from datetime import datetime, timedelta

from app.models.appointment import AppointmentCreate, AppointmentUpdate
from app.storage import appointments_db, patients_db


def patient_exists(patient_id: str) -> bool:
    """Check whether a patient exists in storage."""
    return patient_id in patients_db


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


def get_all_appointments(patient_id: str | None = None) -> list[dict]:
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
