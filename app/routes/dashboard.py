"""Dashboard route providing aggregated metrics."""

from fastapi import APIRouter

from app.models.dashboard import DashboardMetrics
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardMetrics)
def get_dashboard() -> dict:
    """Return aggregated dashboard metrics."""
    return dashboard_service.get_dashboard_metrics()
