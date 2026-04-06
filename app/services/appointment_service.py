"""Service layer for appointment business logic."""

import sqlite3
import uuid
from datetime import datetime as _datetime

from app.models.appointment import AppointmentCreate, AppointmentUpdate
from app import storage


def create_appointment(data: AppointmentCreate) -> dict:
    """Create a new appointment in the database and return it as a dict.

    Raises ValueError if the patient_id does not reference an existing patient.
    """
    appointment_id = str(uuid.uuid4())
    now = _datetime.utcnow().isoformat()
    conn = storage.get_connection()
    try:
        conn.execute(
            "INSERT INTO appointments "
            "(id, patient_id, doctor_name, datetime, status, notes, "
            "created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                appointment_id,
                data.patient_id,
                data.doctor_name,
                data.datetime,
                data.status,
                data.notes,
                now,
                now,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM appointments WHERE id = ?", (appointment_id,)
        ).fetchone()
        return dict(row)
    except sqlite3.IntegrityError:
        raise ValueError("Patient not found")
    finally:
        conn.close()


def get_appointments() -> list[dict]:
    """Return all appointments as a list of dicts."""
    conn = storage.get_connection()
    try:
        rows = conn.execute("SELECT * FROM appointments").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_appointment(appointment_id: str) -> dict | None:
    """Return an appointment dict by id, or None if not found."""
    conn = storage.get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM appointments WHERE id = ?", (appointment_id,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def update_appointment(
    appointment_id: str, data: AppointmentUpdate
) -> dict | None:
    """Update an appointment. Returns updated dict, or None if not found.

    Raises ValueError if the updated patient_id violates the FK constraint.
    """
    conn = storage.get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM appointments WHERE id = ?", (appointment_id,)
        ).fetchone()
        if row is None:
            return None

        updates = data.model_dump(exclude_none=True)
        now = _datetime.utcnow().isoformat()
        updates["updated_at"] = now

        set_parts = []
        values = []
        for key, value in updates.items():
            set_parts.append(key + " = ?")
            values.append(value)
        values.append(appointment_id)

        sql = "UPDATE appointments SET " + ", ".join(set_parts) + " WHERE id = ?"
        conn.execute(sql, values)
        conn.commit()

        row = conn.execute(
            "SELECT * FROM appointments WHERE id = ?", (appointment_id,)
        ).fetchone()
        return dict(row)
    except sqlite3.IntegrityError:
        raise ValueError("Patient not found")
    finally:
        conn.close()


def delete_appointment(appointment_id: str) -> bool:
    """Delete an appointment. Returns True if deleted, False if not found."""
    conn = storage.get_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM appointments WHERE id = ?", (appointment_id,)
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()
