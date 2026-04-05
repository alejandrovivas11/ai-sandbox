"""Tests for the GET /api/health endpoint."""

from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_200() -> None:
    """Verify that GET /api/health returns HTTP 200 status code."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)

    # Assert
    assert response.status_code == 200, (
        f"Expected status 200 but got {response.status_code}"
    )


def test_health_response_has_status_ok() -> None:
    """Verify that GET /api/health response contains 'status' key with value 'ok'."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)
    data = response.json()

    # Assert
    assert "status" in data, "Response JSON missing 'status' key"
    assert data["status"] == "ok", (
        f"Expected status 'ok' but got '{data['status']}'"
    )


def test_health_response_has_timestamp() -> None:
    """Verify that GET /api/health response contains 'timestamp' key with string value."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)
    data = response.json()

    # Assert
    assert "timestamp" in data, "Response JSON missing 'timestamp' key"
    assert isinstance(data["timestamp"], str), (
        f"Expected timestamp to be a string but got {type(data['timestamp']).__name__}"
    )


def test_health_timestamp_is_valid_iso8601() -> None:
    """Verify that timestamp is valid ISO 8601 UTC format ending with +00:00."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)
    data = response.json()
    timestamp_str = data["timestamp"]

    # Assert
    assert timestamp_str.endswith("+00:00"), (
        f"Expected timestamp to end with '+00:00' but got '{timestamp_str}'"
    )
    parsed = datetime.fromisoformat(timestamp_str)
    assert parsed.utcoffset() is not None, "Parsed timestamp has no UTC offset"
    assert parsed.utcoffset().total_seconds() == 0, (
        f"Expected UTC offset of 0 seconds but got {parsed.utcoffset().total_seconds()}"
    )


def test_health_response_schema() -> None:
    """Verify that response JSON contains exactly two keys: 'status' and 'timestamp'."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)
    data = response.json()

    # Assert
    assert set(data.keys()) == {"status", "timestamp"}, (
        f"Expected exactly keys {{'status', 'timestamp'}} but got {set(data.keys())}"
    )
    assert len(data) == 2, (
        f"Expected exactly 2 keys in response but got {len(data)}"
    )


def test_health_endpoint_not_found_for_wrong_path() -> None:
    """Verify that GET /api/healthz returns HTTP 404 status code."""
    # Arrange
    url = "/api/healthz"

    # Act
    response = client.get(url)

    # Assert
    assert response.status_code == 404, (
        f"Expected status 404 for wrong path but got {response.status_code}"
    )


def test_health_endpoint_method_not_allowed() -> None:
    """Verify that POST /api/health returns HTTP 405 Method Not Allowed."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.post(url)

    # Assert
    assert response.status_code == 405, (
        f"Expected status 405 for POST but got {response.status_code}"
    )


def test_health_response_content_type_is_json() -> None:
    """Verify that GET /api/health response has Content-Type containing 'application/json'."""
    # Arrange
    url = "/api/health"

    # Act
    response = client.get(url)

    # Assert
    content_type = response.headers.get("content-type", "")
    assert "application/json" in content_type, (
        f"Expected Content-Type to contain 'application/json' but got '{content_type}'"
    )


def test_health_timestamp_is_recent() -> None:
    """Verify that timestamp in response is within 5 seconds of current UTC time."""
    # Arrange
    url = "/api/health"

    # Act
    before = datetime.now(timezone.utc)
    response = client.get(url)
    after = datetime.now(timezone.utc)
    data = response.json()
    timestamp = datetime.fromisoformat(data["timestamp"])

    # Assert
    assert before <= timestamp <= after, (
        f"Timestamp {timestamp} is not between {before} and {after}"
    )
    delta = (after - timestamp).total_seconds()
    assert delta < 5, (
        f"Timestamp is {delta} seconds old, expected less than 5 seconds"
    )


def test_health_response_model_import() -> None:
    """Verify that HealthResponse can be imported and instantiated directly."""
    # Arrange
    from app.schemas import HealthResponse

    timestamp_value = "2026-04-05T12:00:00+00:00"

    # Act
    model = HealthResponse(status="ok", timestamp=timestamp_value)

    # Assert
    assert model.status == "ok", (
        f"Expected status 'ok' but got '{model.status}'"
    )
    assert model.timestamp == timestamp_value, (
        f"Expected timestamp '{timestamp_value}' but got '{model.timestamp}'"
    )


def test_health_response_schema_has_exactly_two_fields() -> None:
    """Verify that HealthResponse model has exactly two fields via model_fields."""
    # Arrange
    from app.schemas import HealthResponse

    # Act
    fields = HealthResponse.model_fields

    # Assert
    assert len(fields) == 2, (
        f"Expected exactly 2 model fields but got {len(fields)}"
    )
    assert "status" in fields, "HealthResponse missing 'status' field"
    assert "timestamp" in fields, "HealthResponse missing 'timestamp' field"
