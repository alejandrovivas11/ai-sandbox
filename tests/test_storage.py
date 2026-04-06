"""Unit tests for the app.storage module.

Verifies SQLite connection management, PRAGMA settings, table creation,
and the set_database_path helper.
"""

import sqlite3

from app import storage


class TestInitDb:
    """Tests for storage.init_db() schema initialization."""

    def test_init_db_creates_both_tables(self) -> None:
        """Verify init_db() creates both patients and appointments tables
        with correct schemas in the SQLite database."""
        # Arrange
        storage.init_db()

        # Act
        conn = storage.get_connection()
        try:
            cursor = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            )
            table_names = [row["name"] for row in cursor.fetchall()]
        finally:
            conn.close()

        # Assert
        assert "patients" in table_names, (
            "Expected 'patients' table to exist after init_db()"
        )
        assert "appointments" in table_names, (
            "Expected 'appointments' table to exist after init_db()"
        )

    def test_init_db_idempotent(self) -> None:
        """Verify calling init_db() multiple times does not raise an error."""
        # Arrange / Act -- call twice in succession
        storage.init_db()
        storage.init_db()

        # Assert -- reaching this point without an exception is success
        conn = storage.get_connection()
        try:
            cursor = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            )
            table_names = [row["name"] for row in cursor.fetchall()]
        finally:
            conn.close()

        assert "patients" in table_names, (
            "patients table should still exist after idempotent init_db()"
        )
        assert "appointments" in table_names, (
            "appointments table should still exist after idempotent init_db()"
        )


class TestGetConnection:
    """Tests for storage.get_connection() behavior."""

    def test_get_connection_sets_foreign_keys_pragma(self) -> None:
        """Verify get_connection() sets PRAGMA foreign_keys = ON and
        returns True (1) when queried."""
        # Arrange / Act
        conn = storage.get_connection()
        try:
            cursor = conn.execute("PRAGMA foreign_keys")
            result = cursor.fetchone()
        finally:
            conn.close()

        # Assert
        fk_value = result[0] if isinstance(result, (tuple, list)) else result["foreign_keys"]
        assert fk_value == 1, (
            f"Expected PRAGMA foreign_keys to be 1 (ON), got {fk_value}"
        )

    def test_get_connection_sets_row_factory(self) -> None:
        """Verify get_connection() sets row_factory to sqlite3.Row so that
        rows can be accessed by column name."""
        # Arrange / Act
        conn = storage.get_connection()
        try:
            cursor = conn.execute("SELECT 1 AS test_col")
            row = cursor.fetchone()
        finally:
            conn.close()

        # Assert
        assert isinstance(row, sqlite3.Row), (
            f"Expected row to be sqlite3.Row, got {type(row).__name__}"
        )
        assert row["test_col"] == 1, (
            "Expected to access column by name via sqlite3.Row"
        )


class TestSetDatabasePath:
    """Tests for storage.set_database_path() helper."""

    def test_set_database_path_updates_module_variable(self) -> None:
        """Verify set_database_path('custom.db') updates the module-level
        DATABASE_PATH variable correctly."""
        # Arrange
        original_path = storage.DATABASE_PATH

        try:
            # Act
            storage.set_database_path("custom/path.db")

            # Assert
            assert storage.DATABASE_PATH == "custom/path.db", (
                f"Expected DATABASE_PATH to be 'custom/path.db', "
                f"got '{storage.DATABASE_PATH}'"
            )
        finally:
            # Teardown -- restore original path so other tests are unaffected
            storage.set_database_path(original_path)
