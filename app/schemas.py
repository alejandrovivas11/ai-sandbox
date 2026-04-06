"""Pydantic response models for the Health Check API."""

from pydantic import BaseModel

from app.models.patient import (  # noqa: F401
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)


class DashboardResponse(BaseModel):
    """Response model for the dashboard metrics endpoint."""

    total_patients: int
    total_appointments: int
    status_counts: dict[str, int]
    upcoming_appointments: list[dict]


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
