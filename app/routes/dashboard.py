"""Dashboard route providing aggregated statistics."""

from fastapi import APIRouter, status

from app.models.dashboard import DashboardStats
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardStats, status_code=status.HTTP_200_OK)
async def get_dashboard() -> DashboardStats:
    """Return aggregated dashboard statistics."""
    return dashboard_service.get_dashboard_stats()
