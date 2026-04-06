"""SQLite storage layer for the Patient Management API."""

import os
import sqlite3

DATABASE_PATH: str = "data/patients.db"


def set_database_path(path: str) -> None:
    """Update the module-level database path."""
    global DATABASE_PATH
    DATABASE_PATH = path


def get_connection() -> sqlite3.Connection:
    """Create and return a new SQLite connection.

    Each call creates a fresh connection with foreign keys enabled
    and row_factory set to sqlite3.Row for dict-like row access.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Initialize the database schema.

    Creates the data directory and both the patients and appointments
    tables if they do not already exist.
    """
    db_dir = os.path.dirname(DATABASE_PATH)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

    conn = get_connection()
    try:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS patients ("
            "id TEXT PRIMARY KEY, "
            "name TEXT NOT NULL, "
            "email TEXT NOT NULL, "
            "phone TEXT, "
            "date_of_birth TEXT, "
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
