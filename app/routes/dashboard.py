"""Dashboard routes providing aggregated metrics and analytics."""

from datetime import date

from fastapi import APIRouter, Query

from app.models.dashboard import DashboardMetrics
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardMetrics)
def get_dashboard() -> dict:
    """Return aggregated dashboard metrics."""
    return dashboard_service.get_dashboard_metrics()


@router.get("/metrics")
def get_dashboard_metrics_filtered(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> dict:
    """Return dashboard metrics with optional date range filtering."""
    return dashboard_service.get_filtered_dashboard_metrics(
        start_date=start_date.isoformat() if start_date else None,
        end_date=end_date.isoformat() if end_date else None,
    )


@router.get("/stats")
def get_dashboard_stats() -> dict:
    """Return comprehensive dashboard statistics overview."""
    return dashboard_service.get_dashboard_stats()


@router.get("/patients/stats")
def get_patient_analytics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
) -> dict:
    """Return patient analytics with growth rates."""
    return dashboard_service.get_patient_analytics(
        date_from=date_from.isoformat() if date_from else None,
        date_to=date_to.isoformat() if date_to else None,
    )


@router.get("/appointments/stats")
def get_appointment_analytics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
) -> dict:
    """Return appointment analytics with status breakdown."""
    return dashboard_service.get_appointment_analytics(
        date_from=date_from.isoformat() if date_from else None,
        date_to=date_to.isoformat() if date_to else None,
    )


@router.get("/upcoming-appointments")
def get_upcoming_appointments() -> list[dict]:
    """Return upcoming scheduled appointments."""
    return dashboard_service.get_upcoming_appointments()


@router.get("/recent-activity")
def get_recent_activity() -> dict:
    """Return recent activity feed in reverse chronological order."""
    return dashboard_service.get_recent_activity()
