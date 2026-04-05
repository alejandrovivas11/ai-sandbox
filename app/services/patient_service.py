"""Service layer for patient business logic."""

import uuid
from datetime import datetime

from app.models.patient import PatientCreate, PatientUpdate
from app.storage import patients_db


def create_patient(data: PatientCreate) -> dict:
    """Create a new patient, store in memory, and return the full record."""
    patient_id = str(uuid.uuid4())
    now = datetime.utcnow()
    patient = {
        "id": patient_id,
        **data.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    patients_db[patient_id] = patient
    return patient


def get_patient(patient_id: str) -> dict | None:
    """Return a patient dict by id, or None if not found."""
    return patients_db.get(patient_id)


def get_all_patients() -> list[dict]:
    """Return a list of all patient dicts."""
    return list(patients_db.values())


def update_patient(patient_id: str, data: PatientUpdate) -> dict | None:
    """Partially update a patient. Returns updated dict or None if not found."""
    patient = patients_db.get(patient_id)
    if patient is None:
        return None
    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        patient[key] = value
    patient["updated_at"] = datetime.utcnow()
    return patient


def delete_patient(patient_id: str) -> bool:
    """Remove a patient from storage. Returns True if deleted, False if not found."""
    return patients_db.pop(patient_id, None) is not None
