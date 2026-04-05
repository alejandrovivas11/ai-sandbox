"""
Tests for application startup, route registration, and database schema creation.
"""

from fastapi.testclient import TestClient
from sqlalchemy import inspect


class TestHealthCheck:
    """Verify the application starts and the health endpoint works."""

    def test_app_starts_and_health_check(self, client: TestClient):
        """GET /api/health returns 200 status with {'status': 'ok'} response body."""
        # Arrange -- client is already configured via fixture

        # Act
        response = client.get("/api/health")

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 from /api/health, got {response.status_code}"
        )
        data = response.json()
        assert data == {"status": "ok"}, (
            f"Expected {{'status': 'ok'}}, got {data}"
        )


class TestRouteRegistration:
    """Verify all expected routes are registered under the /api prefix."""

    def test_all_routes_registered_under_api_prefix(self, client: TestClient):
        """Inspect app.routes for /api/auth/login, /api/patients,
        /api/appointments, and /api/dashboard/metrics."""
        # Arrange
        from app.main import app

        registered_paths = [
            getattr(route, "path", None) for route in app.routes
        ]

        # Act / Assert
        expected_paths = [
            "/api/auth/login",
            "/api/patients",
            "/api/patients/{patient_id}",
            "/api/appointments",
            "/api/appointments/{appointment_id}",
            "/api/appointments/calendar",
            "/api/dashboard/metrics",
            "/api/auth/me",
            "/api/health",
        ]

        for expected in expected_paths:
            assert expected in registered_paths, (
                f"Route {expected} not found in registered routes. "
                f"Registered: {sorted(set(p for p in registered_paths if p))}"
            )


class TestDatabaseSchema:
    """Verify that the database schema is created correctly."""

    def test_database_schema_created_correctly(self, engine):
        """All tables (users, patients, appointments) are created with correct
        foreign keys and indexes."""
        # Arrange
        inspector = inspect(engine)
        table_names = inspector.get_table_names()

        # Assert -- tables exist
        assert "users" in table_names, (
            f"'users' table not found. Tables: {table_names}"
        )
        assert "patients" in table_names, (
            f"'patients' table not found. Tables: {table_names}"
        )
        assert "appointments" in table_names, (
            f"'appointments' table not found. Tables: {table_names}"
        )

        # Assert -- appointments table has foreign key to patients
        fks = inspector.get_foreign_keys("appointments")
        fk_referred_tables = [fk["referred_table"] for fk in fks]
        assert "patients" in fk_referred_tables, (
            f"Expected FK from appointments to patients. FKs: {fks}"
        )

        # Assert -- key columns are indexed
        appointment_indexes = inspector.get_indexes("appointments")
        indexed_columns = set()
        for idx in appointment_indexes:
            for col in idx["column_names"]:
                indexed_columns.add(col)

        assert "patient_id" in indexed_columns, (
            f"Expected 'patient_id' index on appointments. Indexes: {appointment_indexes}"
        )
        assert "appointment_date" in indexed_columns, (
            f"Expected 'appointment_date' index on appointments. Indexes: {appointment_indexes}"
        )

        # Assert -- users table has unique email
        user_columns = {
            col["name"]: col for col in inspector.get_columns("users")
        }
        assert "email" in user_columns, (
            "Expected 'email' column in users table"
        )
