"""Pydantic model for dashboard metrics."""

from pydantic import BaseModel, StrictInt


class DashboardMetrics(BaseModel):
    """Aggregated metrics for the dashboard endpoint.

    All fields are required integers with no default values.
    """

    total_patients: StrictInt
    total_appointments: StrictInt
    upcoming_appointments_count: StrictInt
    completed_appointments_count: StrictInt
    cancelled_appointments_count: StrictInt
    patients_seen_today: StrictInt
