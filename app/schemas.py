"""Pydantic response models for the Health Check API."""

from pydantic import BaseModel

from app.models.patient import (  # noqa: F401
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str
    timestamp: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "ok",
                "timestamp": "2026-04-05T12:00:00+00:00",
            }
        }
    }
