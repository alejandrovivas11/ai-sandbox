"""Service layer for patient business logic."""

import uuid
from datetime import datetime as _datetime

from app.models.patient import PatientCreate, PatientUpdate
from app import storage


def create_patient(data: PatientCreate) -> dict:
    """Create a new patient in the database and return it as a dict."""
    patient_id = str(uuid.uuid4())
    now = _datetime.utcnow().isoformat()
    conn = storage.get_connection()
    try:
        conn.execute(
            "INSERT INTO patients "
            "(id, first_name, last_name, date_of_birth, gender, "
            "phone_number, email, address, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                patient_id,
                data.first_name,
                data.last_name,
                str(data.date_of_birth),
                data.gender,
                data.phone_number,
                data.email,
                data.address,
                now,
                now,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_patient(patient_id: str) -> dict | None:
    """Return a patient dict by id, or None if not found."""
    conn = storage.get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_all_patients() -> list[dict]:
    """Return a list of all patient dicts."""
    conn = storage.get_connection()
    try:
        rows = conn.execute("SELECT * FROM patients").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def update_patient(patient_id: str, data: PatientUpdate) -> dict | None:
    """Partially update a patient. Returns updated dict or None if not found."""
    conn = storage.get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        if row is None:
            return None

        updates = data.model_dump(exclude_none=True)
        now = _datetime.utcnow().isoformat()
        updates["updated_at"] = now

        # Convert date objects to strings for SQLite storage
        for key, value in updates.items():
            if hasattr(value, "isoformat"):
                updates[key] = value.isoformat()

        set_parts = []
        values = []
        for key, value in updates.items():
            set_parts.append(key + " = ?")
            values.append(value)
        values.append(patient_id)

        sql = "UPDATE patients SET " + ", ".join(set_parts) + " WHERE id = ?"
        conn.execute(sql, values)
        conn.commit()

        row = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def delete_patient(patient_id: str) -> bool:
    """Remove a patient. Returns True if deleted, False if not found."""
    conn = storage.get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        if row is None:
            return False
        conn.execute("DELETE FROM patients WHERE id = ?", (patient_id,))
        conn.commit()
        return True
    finally:
        conn.close()
