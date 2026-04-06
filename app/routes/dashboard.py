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


@router.get("/stats")
def get_dashboard_stats() -> dict:
    """Return comprehensive dashboard statistics overview."""
    return dashboard_service.get_dashboard_stats()


@router.get("/patient-analytics")
def get_patient_analytics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
) -> dict:
    """Return patient analytics with growth rates."""
    return dashboard_service.get_patient_analytics(
        date_from=date_from.isoformat() if date_from else None,
        date_to=date_to.isoformat() if date_to else None,
    )


@router.get("/appointment-analytics")
def get_appointment_analytics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
) -> dict:
    """Return appointment analytics with status breakdown."""
    return dashboard_service.get_appointment_analytics(
        date_from=date_from.isoformat() if date_from else None,
        date_to=date_to.isoformat() if date_to else None,
    )


@router.get("/recent-activity")
def get_recent_activity() -> dict:
    """Return recent activity feed in reverse chronological order."""
    return dashboard_service.get_recent_activity()
