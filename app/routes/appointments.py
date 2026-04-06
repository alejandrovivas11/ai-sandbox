"""Appointment API routes (stub for Task 2)."""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("/")
def create_appointment() -> dict:
    """Stub: appointment creation not yet implemented."""
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/")
def get_appointments() -> list:
    """Stub: return empty appointments list."""
    return []
