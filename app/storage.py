"""SQLite storage for the Patient Management API."""

import sqlite3

DB_PATH = "patient_management.db"

# Legacy in-memory stores kept for backward compatibility with dashboard service
patients_db: dict = {}
appointments_db: dict = {}


def get_connection() -> sqlite3.Connection:
    """Return a new SQLite connection with Row factory and FK enforcement."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    """Create all required tables if they do not already exist."""
    conn = get_connection()
    try:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS patients ("
            "id TEXT PRIMARY KEY, "
            "first_name TEXT NOT NULL, "
            "last_name TEXT NOT NULL, "
            "date_of_birth TEXT NOT NULL, "
            "gender TEXT NOT NULL, "
            "phone_number TEXT NOT NULL, "
            "email TEXT, "
            "address TEXT, "
            "created_at TEXT NOT NULL, "
            "updated_at TEXT NOT NULL"
            ")"
        )
        conn.execute(
            "CREATE TABLE IF NOT EXISTS appointments ("
            "id TEXT PRIMARY KEY, "
            "patient_id TEXT NOT NULL, "
            "doctor_name TEXT NOT NULL, "
            "datetime TEXT NOT NULL, "
            "status TEXT NOT NULL DEFAULT 'scheduled', "
            "notes TEXT, "
            "created_at TEXT NOT NULL, "
            "updated_at TEXT NOT NULL, "
            "FOREIGN KEY (patient_id) REFERENCES patients(id)"
            ")"
        )
        conn.commit()
    finally:
        conn.close()


def reset() -> None:
    """Clear all data from the database."""
    conn = get_connection()
    try:
        conn.execute("DELETE FROM appointments")
        conn.execute("DELETE FROM patients")
        conn.commit()
    finally:
        conn.close()
