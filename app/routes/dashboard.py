"""Dashboard route (stub for Task 3)."""

from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def get_dashboard() -> dict:
    """Stub: return empty dashboard response."""
    return {}
