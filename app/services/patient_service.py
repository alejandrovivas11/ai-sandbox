"""Service layer for patient business logic."""

from app.models.patient import PatientCreate, PatientUpdate
from app.storage import get_storage


def create_patient(data: PatientCreate) -> dict:
    """Create a new patient, store it, and return the full record.

    Returns an integer patient_id consistently.
    """
    dump = data.model_dump()
    # Convert date objects to ISO strings for SQL storage
    if hasattr(dump["date_of_birth"], "isoformat"):
        dump["date_of_birth"] = dump["date_of_birth"].isoformat()
    return get_storage().insert_patient(**dump)


def get_patient(patient_id: int) -> dict | None:
    """Return a patient dict by integer id, or None if not found."""
    return get_storage().get_patient(patient_id)


def get_all_patients() -> list[dict]:
    """Return a list of all patient dicts."""
    return get_storage().get_all_patients()


def update_patient(patient_id: int, data: PatientUpdate) -> dict | None:
    """Partially update a patient. Returns updated dict or None if not found."""
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        return get_storage().get_patient(patient_id)
    if "date_of_birth" in updates and hasattr(
        updates["date_of_birth"], "isoformat"
    ):
        updates["date_of_birth"] = updates["date_of_birth"].isoformat()
    return get_storage().update_patient(patient_id, **updates)


def delete_patient(patient_id: int) -> bool:
    """Remove a patient from storage. Returns True if deleted, False if not found."""
    return get_storage().delete_patient(patient_id)
