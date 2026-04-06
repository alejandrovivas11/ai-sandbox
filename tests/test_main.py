"""Tests for the FastAPI application entrypoint (app/main.py).

Verifies root endpoint behavior, application type, and that init_db()
correctly initializes the database schema.
"""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app import storage


class TestRootEndpoint:
    """Tests for the GET / root endpoint."""

    def test_root_endpoint(self, client: TestClient) -> None:
        """Verify GET / returns 200 with the API identification message."""
        # Arrange -- client fixture provides the TestClient

        # Act
        response = client.get("/")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 OK, got {response.status_code}"
        )
        assert response.json() == {"message": "Patient Management API"}, (
            f"Expected API identification message, got {response.json()}"
        )


class TestAppStartup:
    """Tests verifying the FastAPI application is configured correctly."""

    def test_app_startup(self) -> None:
        """Verify the app object is a FastAPI instance."""
        # Arrange / Act
        from app.main import app

        # Assert
        assert isinstance(app, FastAPI), (
            f"Expected app to be a FastAPI instance, got {type(app).__name__}"
        )


class TestInitDbIntegration:
    """Tests verifying init_db() creates the expected database schema."""

    def test_init_db_creates_tables(self) -> None:
        """Verify that calling storage.init_db() creates both the patients
        and appointments tables in the SQLite database."""
        # Arrange
        storage.init_db()

        # Act
        conn = storage.get_connection()
        try:
            cursor = conn.execute(
                "SELECT name FROM sqlite_master "
                "WHERE type='table' AND name IN ('patients', 'appointments') "
                "ORDER BY name"
            )
            table_names = [row["name"] for row in cursor.fetchall()]
        finally:
            conn.close()

        # Assert
        assert "patients" in table_names, (
            "Expected 'patients' table to be created by init_db()"
        )
        assert "appointments" in table_names, (
            "Expected 'appointments' table to be created by init_db()"
        )

    def test_init_db_idempotent(self) -> None:
        """Verify calling init_db() twice does not raise an error and
        tables still exist afterward."""
        # Arrange / Act
        storage.init_db()
        storage.init_db()

        # Assert -- no exception means success; verify tables remain
        conn = storage.get_connection()
        try:
            cursor = conn.execute(
                "SELECT name FROM sqlite_master "
                "WHERE type='table' AND name IN ('patients', 'appointments') "
                "ORDER BY name"
            )
            table_names = [row["name"] for row in cursor.fetchall()]
        finally:
            conn.close()

        assert len(table_names) == 2, (
            f"Expected 2 tables after idempotent init_db(), found {len(table_names)}"
        )
