"""SQL-based storage layer for the Patient Management API.

Provides a SQLite-backed storage class with raw SQL queries, JOIN
operations, and proper foreign key handling between patients and
appointments tables.  Uses integer primary keys throughout.
"""

import sqlite3
from datetime import datetime, timedelta

from app.migrations import run_migrations


class SQLStorage:
    """SQLite-backed storage with raw SQL queries and JOIN support."""

    def __init__(self, db_path: str = ":memory:") -> None:
        self._conn = sqlite3.connect(db_path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA foreign_keys = ON")
        run_migrations(self._conn)

    @property
    def connection(self) -> sqlite3.Connection:
        """Expose the underlying connection for advanced use."""
        return self._conn

    # ------------------------------------------------------------------ #
    #  Helpers                                                            #
    # ------------------------------------------------------------------ #

    @staticmethod
    def _row_to_dict(row: sqlite3.Row | None) -> dict | None:
        """Convert a sqlite3.Row to a plain dict, or return None."""
        if row is None:
            return None
        return dict(row)

    # ------------------------------------------------------------------ #
    #  Patient operations                                                 #
    # ------------------------------------------------------------------ #

    def insert_patient(
        self,
        first_name: str,
        last_name: str,
        date_of_birth: str,
        gender: str,
        phone_number: str,
        email: str | None = None,
        address: str | None = None,
        created_at: str = "",
        updated_at: str = "",
    ) -> dict:
        """Insert a new patient row and return the full record."""
        now = created_at or datetime.utcnow().isoformat()
        updated = updated_at or now
        cursor = self._conn.execute(
            """INSERT INTO patients
               (first_name, last_name, date_of_birth, gender, phone_number,
                email, address, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone_number,
                email,
                address,
                now,
                updated,
            ),
        )
        self._conn.commit()
        return self.get_patient(cursor.lastrowid)  # type: ignore[return-value]

    def get_patient(self, patient_id: int) -> dict | None:
        """Return a patient dict by integer id, or None."""
        row = self._conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        return self._row_to_dict(row)

    def get_all_patients(self) -> list[dict]:
        """Return all patient records."""
        rows = self._conn.execute("SELECT * FROM patients").fetchall()
        return [dict(r) for r in rows]

    def update_patient(self, patient_id: int, **fields: object) -> dict | None:
        """Partially update a patient.  Returns updated dict or None."""
        existing = self.get_patient(patient_id)
        if existing is None:
            return None
        fields["updated_at"] = datetime.utcnow().isoformat()
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        values = list(fields.values()) + [patient_id]
        self._conn.execute(
            f"UPDATE patients SET {set_clause} WHERE id = ?", values
        )
        self._conn.commit()
        return self.get_patient(patient_id)

    def delete_patient(self, patient_id: int) -> bool:
        """Delete a patient.  Returns True if a row was removed."""
        cursor = self._conn.execute(
            "DELETE FROM patients WHERE id = ?", (patient_id,)
        )
        self._conn.commit()
        return cursor.rowcount > 0

    def patient_exists(self, patient_id: int) -> bool:
        """Return True if a patient with the given integer id exists."""
        row = self._conn.execute(
            "SELECT 1 FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        return row is not None

    # ------------------------------------------------------------------ #
    #  Appointment operations                                             #
    # ------------------------------------------------------------------ #

    def insert_appointment(
        self,
        patient_id: int,
        date_time: str,
        appointment_type: str,
        status: str = "scheduled",
        duration_minutes: int = 30,
        created_at: str = "",
        updated_at: str = "",
    ) -> dict:
        """Insert a new appointment and return the full record (integer id)."""
        now = created_at or datetime.utcnow().isoformat()
        updated = updated_at or now
        cursor = self._conn.execute(
            """INSERT INTO appointments
               (patient_id, date_time, appointment_type, status,
                duration_minutes, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                patient_id,
                date_time,
                appointment_type,
                status,
                duration_minutes,
                now,
                updated,
            ),
        )
        self._conn.commit()
        return self.get_appointment(cursor.lastrowid)  # type: ignore[return-value]

    def get_appointment(self, appointment_id: int) -> dict | None:
        """Return an appointment dict by integer id, or None."""
        row = self._conn.execute(
            "SELECT * FROM appointments WHERE id = ?", (appointment_id,)
        ).fetchone()
        return self._row_to_dict(row)

    def get_appointment_with_patient(self, appointment_id: int) -> dict | None:
        """JOIN appointment with its patient data.

        Returns a merged dict containing all appointment columns plus
        patient columns (first_name, last_name, etc.) and a nested
        ``patient`` key for convenience.  Returns None when the
        appointment does not exist.
        """
        row = self._conn.execute(
            """SELECT a.*,
                      p.first_name, p.last_name, p.date_of_birth,
                      p.gender, p.phone_number, p.email AS patient_email,
                      p.address
               FROM appointments a
               JOIN patients p ON a.patient_id = p.id
               WHERE a.id = ?""",
            (appointment_id,),
        ).fetchone()
        if row is None:
            return None
        result = dict(row)
        patient = self.get_patient(result["patient_id"])
        if patient is not None:
            result["patient"] = patient
        return result

    def get_all_appointments(
        self,
        patient_id: int | None = None,
        date_from: str | None = None,
        date_to: str | None = None,
        status: str | None = None,
    ) -> list[dict]:
        """Return appointments with optional filters.

        Supports filtering by patient_id, date range, and status.
        """
        query = "SELECT * FROM appointments WHERE 1=1"
        params: list[object] = []
        if patient_id is not None:
            query += " AND patient_id = ?"
            params.append(patient_id)
        if date_from is not None:
            query += " AND date_time >= ?"
            params.append(date_from)
        if date_to is not None:
            query += " AND date_time <= ?"
            params.append(date_to)
        if status is not None:
            query += " AND status = ?"
            params.append(status)
        query += " ORDER BY date_time"
        rows = self._conn.execute(query, params).fetchall()
        return [dict(r) for r in rows]

    def has_scheduling_conflict(
        self,
        patient_id: int,
        date_time: str,
        duration_minutes: int,
        exclude_appointment_id: int | None = None,
    ) -> bool:
        """Check for overlapping appointments for a given patient.

        Uses a SQL query to fetch candidate appointments filtered by
        patient_id and non-cancelled status, then performs time-overlap
        detection.  Cancelled appointments are ignored.
        """
        new_start = datetime.fromisoformat(date_time)
        new_end = new_start + timedelta(minutes=duration_minutes)

        query = """
            SELECT id, date_time, duration_minutes FROM appointments
            WHERE patient_id = ?
              AND status != 'cancelled'
        """
        params: list[object] = [patient_id]
        if exclude_appointment_id is not None:
            query += " AND id != ?"
            params.append(exclude_appointment_id)

        rows = self._conn.execute(query, params).fetchall()
        for row in rows:
            existing_start = datetime.fromisoformat(row["date_time"])
            existing_end = existing_start + timedelta(
                minutes=row["duration_minutes"]
            )
            if new_start < existing_end and existing_start < new_end:
                return True
        return False

    def update_appointment(
        self, appointment_id: int, **fields: object
    ) -> dict | None:
        """Partially update an appointment.  Returns updated dict or None."""
        existing = self.get_appointment(appointment_id)
        if existing is None:
            return None
        fields["updated_at"] = datetime.utcnow().isoformat()
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        values = list(fields.values()) + [appointment_id]
        self._conn.execute(
            f"UPDATE appointments SET {set_clause} WHERE id = ?", values
        )
        self._conn.commit()
        return self.get_appointment(appointment_id)

    def delete_appointment(self, appointment_id: int) -> bool:
        """Delete an appointment.  Returns True if a row was removed."""
        cursor = self._conn.execute(
            "DELETE FROM appointments WHERE id = ?", (appointment_id,)
        )
        self._conn.commit()
        return cursor.rowcount > 0

    # ------------------------------------------------------------------ #
    #  Utility                                                            #
    # ------------------------------------------------------------------ #

    def reset(self) -> None:
        """Drop and recreate all tables, clearing all stored data."""
        self._conn.execute("DROP TABLE IF EXISTS appointments")
        self._conn.execute("DROP TABLE IF EXISTS patients")
        self._conn.commit()
        run_migrations(self._conn)


# -- module-level singleton ------------------------------------------------ #

_storage: SQLStorage = SQLStorage()


def get_storage() -> SQLStorage:
    """Return the global SQLStorage instance."""
    return _storage


def reset() -> None:
    """Reset the global storage (clear all data)."""
    _storage.reset()
