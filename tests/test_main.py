"""Tests for the app.main module configuration and code quality."""

import ast

from app.main import app


def test_app_title() -> None:
    """Verify that FastAPI app has title set to 'Health Check API'."""
    # Arrange / Act
    title = app.title

    # Assert
    assert title == "Health Check API", (
        f"Expected app title 'Health Check API' but got '{title}'"
    )


def test_import_no_relative_imports() -> None:
    """Verify that app/main.py uses absolute imports, not relative imports."""
    # Arrange
    with open("app/main.py", "r") as f:
        source = f.read()
    tree = ast.parse(source)

    # Act
    relative_imports = [
        node for node in ast.walk(tree)
        if isinstance(node, ast.ImportFrom) and node.level > 0
    ]

    # Assert
    assert len(relative_imports) == 0, (
        f"Found {len(relative_imports)} relative import(s) in app/main.py; "
        "use absolute imports (e.g., 'from app.schemas import HealthResponse')"
    )

    # Also verify the expected absolute import exists
    absolute_schema_imports = [
        node for node in ast.walk(tree)
        if isinstance(node, ast.ImportFrom)
        and node.module == "app.schemas"
        and node.level == 0
    ]
    assert len(absolute_schema_imports) > 0, (
        "Expected 'from app.schemas import HealthResponse' in app/main.py"
    )


def test_no_deprecated_datetime_usage() -> None:
    """Verify that datetime.now(timezone.utc) is used instead of deprecated datetime.utcnow()."""
    # Arrange
    with open("app/main.py", "r") as f:
        source = f.read()

    # Act / Assert
    assert "utcnow()" not in source, (
        "Found deprecated 'utcnow()' usage in app/main.py; "
        "use 'datetime.now(timezone.utc)' instead"
    )
    assert "datetime.now(timezone.utc)" in source, (
        "Expected 'datetime.now(timezone.utc)' in app/main.py but not found"
    )
