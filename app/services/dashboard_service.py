"""Service layer for computing dashboard statistics."""

import datetime

from app import storage
from app.models.dashboard import DashboardStats


def get_dashboard_stats() -> DashboardStats:
    """Compute aggregated dashboard statistics from in-memory data stores.

    Returns a DashboardStats instance with patient/appointment counts,
    status breakdowns, recent appointments, and today's appointments.
    """
    total_patients: int = storage.count_patients()
    total_appointments: int = storage.count_appointments()
    upcoming_appointments: int = storage.count_appointments_by_status("scheduled")
    completed_appointments: int = storage.count_appointments_by_status("completed")
    cancelled_appointments: int = storage.count_appointments_by_status("cancelled")
    recent_appointments: list[dict] = storage.get_recent_appointments(limit=5)
    today_str: str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    today_appointments: list[dict] = storage.get_appointments_today(today_str)

    return DashboardStats(
        total_patients=total_patients,
        total_appointments=total_appointments,
        upcoming_appointments=upcoming_appointments,
        completed_appointments=completed_appointments,
        cancelled_appointments=cancelled_appointments,
        recent_appointments=recent_appointments,
        today_appointments=today_appointments,
    )
