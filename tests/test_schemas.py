"""Tests for the app.schemas module."""

from pydantic import BaseModel


def test_health_response_model_structure() -> None:
    """Verify that HealthResponse inherits from BaseModel and has correct field types."""
    # Arrange
    from app.schemas import HealthResponse

    # Act
    fields = HealthResponse.model_fields

    # Assert
    assert issubclass(HealthResponse, BaseModel), (
        "HealthResponse must inherit from pydantic BaseModel"
    )
    assert "status" in fields, "HealthResponse missing 'status' field"
    assert "timestamp" in fields, "HealthResponse missing 'timestamp' field"
    assert fields["status"].annotation is str, (
        f"Expected 'status' field type to be str but got {fields['status'].annotation}"
    )
    assert fields["timestamp"].annotation is str, (
        f"Expected 'timestamp' field type to be str but got {fields['timestamp'].annotation}"
    )


def test_health_response_model_config() -> None:
    """Verify that HealthResponse has model_config with json_schema_extra containing example data."""
    # Arrange
    from app.schemas import HealthResponse

    # Act
    config = HealthResponse.model_config

    # Assert
    assert "json_schema_extra" in config, (
        "HealthResponse model_config missing 'json_schema_extra'"
    )
    extra = config["json_schema_extra"]
    assert "example" in extra, (
        "json_schema_extra missing 'example' key"
    )
    example = extra["example"]
    assert "status" in example, "Example missing 'status' key"
    assert example["status"] == "ok", (
        f"Expected example status 'ok' but got '{example['status']}'"
    )
    assert "timestamp" in example, "Example missing 'timestamp' key"
    assert isinstance(example["timestamp"], str), (
        "Expected example timestamp to be a string"
    )


def test_health_response_serialization() -> None:
    """Verify that HealthResponse instance can be serialized to JSON with correct fields."""
    # Arrange
    from app.schemas import HealthResponse

    timestamp_value = "2026-04-05T12:00:00+00:00"
    model = HealthResponse(status="ok", timestamp=timestamp_value)

    # Act
    serialized = model.model_dump()

    # Assert
    assert serialized == {"status": "ok", "timestamp": timestamp_value}, (
        f"Serialized model does not match expected output: {serialized}"
    )
    json_str = model.model_dump_json()
    assert '"status"' in json_str, "JSON output missing 'status' field name"
    assert '"timestamp"' in json_str, "JSON output missing 'timestamp' field name"
    assert '"ok"' in json_str, "JSON output missing 'ok' value"
    assert timestamp_value in json_str, (
        f"JSON output missing timestamp value '{timestamp_value}'"
    )
