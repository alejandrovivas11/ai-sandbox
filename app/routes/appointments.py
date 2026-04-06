"""Appointment API routes."""

from fastapi import APIRouter, HTTPException, status

from app.models.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from app.services import appointment_service

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post(
    "/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def create_appointment(data: AppointmentCreate) -> dict:
    """Create a new appointment after validating the patient exists via FK."""
    try:
        return appointment_service.create_appointment(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[AppointmentResponse])
def get_appointments() -> list[dict]:
    """Return all appointments."""
    return appointment_service.get_appointments()


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: str) -> dict:
    """Return a single appointment by id."""
    appointment = appointment_service.get_appointment(appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(appointment_id: str, data: AppointmentUpdate) -> dict:
    """Update an existing appointment."""
    try:
        appointment = appointment_service.update_appointment(
            appointment_id, data
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: str) -> dict:
    """Delete an appointment by id."""
    deleted = appointment_service.delete_appointment(appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted"}
