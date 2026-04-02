import inspect
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def test_package_directories_exist():
    packages = [
        "app/models",
        "app/schemas",
        "app/routers",
        "app/services",
        "app/core",
        "tests",
    ]
    for pkg in packages:
        pkg_dir = ROOT / pkg
        assert pkg_dir.is_dir(), f"{pkg} directory does not exist"
        init_file = pkg_dir / "__init__.py"
        assert init_file.is_file(), f"{pkg}/__init__.py does not exist"


def test_requirements_parseable():
    req_path = ROOT / "requirements.txt"
    assert req_path.is_file(), "requirements.txt does not exist"
    content = req_path.read_text()
    expected = [
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "alembic",
        "pydantic[email]",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "httpx",
        "pytest",
        "pytest-asyncio",
    ]
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    for dep in expected:
        assert any(
            dep in line for line in lines
        ), f"Dependency '{dep}' not found in requirements.txt"
    assert len(lines) >= len(expected), (
        f"Expected at least {len(expected)} dependencies, found {len(lines)}"
    )


def test_settings_class_defaults():
    from app.core.config import Settings

    s = Settings()
    assert s.DATABASE_URL == "sqlite:///./patient_portal.db"
    assert s.SECRET_KEY == "your-secret-key-change-in-production"
    assert s.ALGORITHM == "HS256"
    assert s.ACCESS_TOKEN_EXPIRE_MINUTES == 30


def test_database_module_exports():
    from app.core import database

    assert hasattr(database, "engine")
    assert hasattr(database, "SessionLocal")
    assert hasattr(database, "Base")
    assert hasattr(database, "get_db")
    assert inspect.isgeneratorfunction(database.get_db)


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
