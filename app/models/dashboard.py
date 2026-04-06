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


class DashboardStats(BaseModel):
    """Comprehensive dashboard statistics overview."""

    total_patients: StrictInt = Field(ge=0)
    total_appointments: StrictInt = Field(ge=0)
    appointments_today: StrictInt = Field(ge=0)
    new_patients_this_month: StrictInt = Field(ge=0)


class PatientStats(BaseModel):
    """Patient-specific analytics and demographics."""

    total_count: StrictInt = Field(ge=0)
    new_this_month: StrictInt = Field(ge=0)
    average_age: float = Field(default=0.0, ge=0.0)
    gender_distribution: dict[str, int] = Field(default_factory=dict)


class AppointmentStats(BaseModel):
    """Appointment status breakdown and completion metrics."""

    total_scheduled: StrictInt = Field(ge=0)
    completed: StrictInt = Field(ge=0)
    cancelled: StrictInt = Field(ge=0)
    no_show: StrictInt = Field(ge=0)
    completion_rate: float = Field(default=0.0, ge=0.0, le=100.0)


class RecentActivity(BaseModel):
    """Single activity event for the recent activity feed."""

    id: int
    type: str
    description: str
    timestamp: str
    patient_name: str
