import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import storage


@pytest.fixture
def client() -> TestClient:
    """Return a TestClient instance wired to the FastAPI application."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_storage():
    """Clear in-memory storage before and after every test for full isolation."""
    storage.reset()
    yield
    storage.reset()
