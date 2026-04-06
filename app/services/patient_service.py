"""Service layer for patient business logic using SQLite storage."""

import uuid
from datetime import datetime

from app import storage
from app.models.patient import PatientCreate, PatientUpdate


def create_patient(data: PatientCreate) -> dict:
    """Create a new patient in SQLite and return the full record."""
    patient_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    conn = storage.get_connection()
    try:
        conn.execute(
            "INSERT INTO patients "
            "(id, name, email, phone, date_of_birth, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (patient_id, data.name, data.email, data.phone,
             data.date_of_birth, now, now),
        )
        conn.commit()
        cursor = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        )
        row = cursor.fetchone()
        return dict(row)
    finally:
        conn.close()


def get_patients() -> list[dict]:
    """Return a list of all patients."""
    conn = storage.get_connection()
    try:
        cursor = conn.execute("SELECT * FROM patients")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()


def get_patient(patient_id: str) -> dict | None:
    """Return a patient dict by id, or None if not found."""
    conn = storage.get_connection()
    try:
        cursor = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return dict(row)
    finally:
        conn.close()


def update_patient(patient_id: str, data: PatientUpdate) -> dict | None:
    """Partially update a patient. Returns updated dict or None."""
    conn = storage.get_connection()
    try:
        cursor = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        )
        if cursor.fetchone() is None:
            return None

        updates = data.model_dump(exclude_none=True)

        allowed_fields = {"name", "email", "phone", "address"}
        for key in updates:
            if key not in allowed_fields:
                raise ValueError(f"Invalid field: {key}")

        now = datetime.utcnow().isoformat()
        updates["updated_at"] = now

        set_clauses = [f"{key} = ?" for key in updates]
        values = list(updates.values())
        values.append(patient_id)

        conn.execute(
            "UPDATE patients SET " + ", ".join(set_clauses) + " WHERE id = ?",
            values,
        )
        conn.commit()

        cursor = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        )
        return dict(cursor.fetchone())
    finally:
        conn.close()


def delete_patient(patient_id: str) -> bool:
    """Remove a patient. Returns True if deleted, False if not found."""
    conn = storage.get_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM patients WHERE id = ?", (patient_id,)
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()
