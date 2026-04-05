"""
Pydantic v2 schemas for the dashboard endpoint.
"""

from pydantic import BaseModel

from app.appointments.schemas import AppointmentResponse
from app.patients.schemas import PatientResponse


class DashboardMetrics(BaseModel):
    """Schema for dashboard metrics aggregation."""

    total_patients: int
    todays_appointments: int
    upcoming_week_appointments: int
    recent_patients: list[PatientResponse]
    upcoming_appointments: list[AppointmentResponse]
