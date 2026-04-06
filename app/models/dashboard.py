"""Pydantic models for dashboard metrics and analytics."""

from pydantic import BaseModel, Field, StrictInt


class DashboardMetrics(BaseModel):
    """Aggregated metrics for the dashboard endpoint.

    Count fields must be non-negative integers. Rate fields must be
    within valid percentage bounds.
    """

    total_patients: StrictInt = Field(ge=0)
    total_appointments: StrictInt = Field(ge=0)
    upcoming_appointments_count: StrictInt = Field(ge=0)
    completed_appointments_count: StrictInt = Field(ge=0)
    cancelled_appointments_count: StrictInt = Field(ge=0)
    patients_seen_today: StrictInt = Field(ge=0)
    completion_rate: float = Field(default=0.0, ge=0.0, le=100.0)
    growth_rate: float = Field(default=0.0)
