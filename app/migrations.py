"""Database migration definitions for the Patient Management API.

Defines table schemas, foreign key constraints, and indexes for the
SQLite-backed storage layer.
"""

import sqlite3


SQL_CREATE_PATIENTS_TABLE = """
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    address TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
"""

SQL_CREATE_APPOINTMENTS_TABLE = """
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    date_time TEXT NOT NULL,
    appointment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
"""

SQL_CREATE_INDEXES = [
    "CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);",
    "CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date_time);",
    "CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);",
    "CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);",
]


def run_migrations(conn: sqlite3.Connection) -> None:
    """Execute all table-creation and index-creation migrations.

    Enables foreign key enforcement and creates the patients and
    appointments tables along with performance indexes.
    """
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute(SQL_CREATE_PATIENTS_TABLE)
    cursor.execute(SQL_CREATE_APPOINTMENTS_TABLE)
    for index_sql in SQL_CREATE_INDEXES:
        cursor.execute(index_sql)
    conn.commit()
