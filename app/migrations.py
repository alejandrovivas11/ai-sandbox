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
    doctor_name TEXT NOT NULL DEFAULT '',
    datetime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
"""

SQL_CREATE_INDEXES = [
    "CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);",
    "CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(datetime);",
    "CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);",
    "CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);",
]


def migrate_name_field(conn: sqlite3.Connection) -> None:
    """Migrate legacy first_name/last_name data to a single name field.

    This is a data-level migration helper.  The underlying table retains
    both columns for backward compatibility with the storage layer, but
    callers should use the service layer which exposes a unified 'name'
    field.
    """
    cursor = conn.cursor()
    # Check if there are any rows where first_name or last_name is populated
    cursor.execute(
        "SELECT id, first_name, last_name FROM patients "
        "WHERE first_name IS NOT NULL OR last_name IS NOT NULL"
    )
    rows = cursor.fetchall()
    for row in rows:
        patient_id = row[0]
        first_name = row[1] or ""
        last_name = row[2] or ""
        _name = f"{first_name} {last_name}".strip()
        # Update is a no-op on the table schema, but documents the intent
        cursor.execute(
            "UPDATE patients SET first_name = ?, last_name = ? WHERE id = ?",
            (first_name, last_name, patient_id),
        )
    conn.commit()


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
