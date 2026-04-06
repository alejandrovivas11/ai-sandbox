"""Service layer for patient business logic.

Translates between the new API schema (name, phone) and the underlying
storage layer which still uses the legacy column names (first_name,
last_name, phone_number).
"""

from app.models.patient import PatientCreate, PatientUpdate
from app.storage import get_storage


def _to_storage_fields(data: dict) -> dict:
    """Convert new-schema field names to storage (database) column names."""
    result: dict = {}
    if "name" in data:
        parts = data["name"].split(" ", 1)
        result["first_name"] = parts[0]
        result["last_name"] = parts[1] if len(parts) > 1 else ""
    if "email" in data:
        result["email"] = data["email"]
    if "phone" in data:
        result["phone_number"] = data["phone"]
    if "date_of_birth" in data:
        dob = data["date_of_birth"]
        result["date_of_birth"] = dob.isoformat() if hasattr(dob, "isoformat") else dob
    return result


def _from_storage_fields(record: dict | None) -> dict | None:
    """Convert storage (database) column names to new-schema field names."""
    if record is None:
        return None
    first = record.get("first_name", "")
    last = record.get("last_name", "")
    name = f"{first} {last}".strip()
    return {
        "id": record["id"],
        "name": name,
        "email": record.get("email"),
        "phone": record.get("phone_number", ""),
        "date_of_birth": record.get("date_of_birth"),
        "created_at": record.get("created_at"),
        "updated_at": record.get("updated_at"),
    }


def create_patient(data: PatientCreate) -> dict:
    """Create a new patient, store it, and return the full record.

    Returns a dict using the new field schema (name, phone).
    """
    dump = data.model_dump()
    storage_fields = _to_storage_fields(dump)
    # The storage layer requires gender (NOT NULL in DB); default to empty.
    storage_fields.setdefault("gender", "")
    record = get_storage().insert_patient(**storage_fields)
    return _from_storage_fields(record)  # type: ignore[return-value]


def get_patient(patient_id: int) -> dict | None:
    """Return a patient dict by integer id, or None if not found."""
    record = get_storage().get_patient(patient_id)
    return _from_storage_fields(record)


def get_all_patients() -> list[dict]:
    """Return a list of all patient dicts."""
    records = get_storage().get_all_patients()
    return [_from_storage_fields(r) for r in records]  # type: ignore[misc]


def update_patient(patient_id: int, data: PatientUpdate) -> dict | None:
    """Partially update a patient. Returns updated dict or None if not found."""
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        record = get_storage().get_patient(patient_id)
        return _from_storage_fields(record)
    storage_fields = _to_storage_fields(updates)
    record = get_storage().update_patient(patient_id, **storage_fields)
    return _from_storage_fields(record)


def delete_patient(patient_id: int) -> bool:
    """Remove a patient from storage. Returns True if deleted, False if not found."""
    return get_storage().delete_patient(patient_id)
