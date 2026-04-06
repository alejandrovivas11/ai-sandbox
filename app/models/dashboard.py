"""Pydantic models for dashboard analytics."""

from pydantic import BaseModel, StrictInt


class DashboardMetrics(BaseModel):
    """Aggregated metrics for the dashboard endpoint (legacy).

    All fields are required integers with no default values.
    """

    total_patients: StrictInt
    total_appointments: StrictInt
    upcoming_appointments_count: StrictInt
    completed_appointments_count: StrictInt
    cancelled_appointments_count: StrictInt
    patients_seen_today: StrictInt


class DashboardStats(BaseModel):
    """Aggregated statistics for the dashboard endpoint.

    Count fields default to 0. List fields default to empty lists.
    """

    total_patients: int = 0
    total_appointments: int = 0
    upcoming_appointments: int = 0
    completed_appointments: int = 0
    cancelled_appointments: int = 0
    recent_appointments: list = []
    today_appointments: list = []
