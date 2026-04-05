from fastapi.testclient import TestClient

from app.main import app


def test_app_starts_without_errors() -> None:
    """Verify that the FastAPI application can be instantiated without errors."""
    # Arrange / Act
    client = TestClient(app)

    # Assert -- if we reach here the app started successfully
    assert client is not None, "TestClient should be created successfully"
    assert app.title == "Patient Management API", (
        "App title should be 'Patient Management API'"
    )
    assert app.version == "1.0.0", "App version should be '1.0.0'"


def test_root_endpoint_returns_message() -> None:
    """GET / returns 200 with the correct API message."""
    # Arrange
    client = TestClient(app)

    # Act
    response = client.get("/")

    # Assert
    assert response.status_code == 200, (
        f"Expected 200 OK, got {response.status_code}"
    )
    body = response.json()
    assert body == {"message": "Patient Management API"}, (
        "Root endpoint should return {'message': 'Patient Management API'}"
    )
