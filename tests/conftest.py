"""Shared pytest fixtures for the Patient Management API test suite.

Provides test database isolation using a dedicated SQLite file
(data/test_patients.db) that is created once per session and cleaned
between every test.
"""

import os

import pytest
from fastapi.testclient import TestClient

from app import storage


@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    """Create and initialize a test-only SQLite database.

    Runs once per test session. Sets the database path to a test-specific
    file, initializes the schema, yields for all tests, then removes the
    file on teardown.
    """
    storage.set_database_path("data/test_patients.db")
    storage.init_db()
    yield
    if os.path.exists("data/test_patients.db"):
        os.remove("data/test_patients.db")


@pytest.fixture(autouse=True)
def clean_tables():
    """Delete all rows from every table between tests.

    Ordering matters: appointments first (FK to patients), then patients.
    This ensures each test starts with a clean slate without recreating
    the schema.
    """
    conn = storage.get_connection()
    try:
        conn.execute("DELETE FROM appointments")
        conn.execute("DELETE FROM patients")
        conn.commit()
    finally:
        conn.close()
    yield


@pytest.fixture
def client() -> TestClient:
    """Return a TestClient instance wired to the FastAPI application."""
    from app.main import app

    return TestClient(app)


@pytest.fixture
def sample_patient_data() -> dict:
    """Return a minimal valid patient payload for POST /patients."""
    return {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "555-123-4567",
        "date_of_birth": "1990-01-15",
    }
