"""Appointment API routes."""

from fastapi import APIRouter, HTTPException, Response, status

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
    """Create a new appointment after validating the patient exists."""
    if not appointment_service.patient_exists(data.patient_id):
        raise HTTPException(
            status_code=404,
            detail=f"Patient {data.patient_id} not found",
        )
    if appointment_service.has_scheduling_conflict(
        data.patient_id, data.date_time, data.duration_minutes
    ):
        raise HTTPException(
            status_code=409,
            detail="Scheduling conflict: overlapping appointment exists",
        )
    return appointment_service.create_appointment(data)


@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(
    patient_id: int | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    status: str | None = None,
) -> list[dict]:
    """Return all appointments, with optional filters."""
    return appointment_service.get_all_appointments(
        patient_id=patient_id,
        date_from=date_from,
        date_to=date_to,
        status=status,
    )


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int) -> dict:
    """Return a single appointment by integer id."""
    appointment = appointment_service.get_appointment(appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.get("/{appointment_id}/with-patient")
def get_appointment_with_patient(appointment_id: int) -> dict:
    """Return an appointment joined with its patient data."""
    result = appointment_service.get_appointment_with_patient(appointment_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return result


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(appointment_id: int, data: AppointmentUpdate) -> dict:
    """Partially update an existing appointment."""
    updates = data.model_dump(exclude_unset=True)
    if "patient_id" in updates and not appointment_service.patient_exists(
        updates["patient_id"]
    ):
        raise HTTPException(
            status_code=404,
            detail=f"Patient {updates['patient_id']} not found",
        )
    appointment = appointment_service.update_appointment(appointment_id, data)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int) -> Response:
    """Delete an appointment by integer id."""
    deleted = appointment_service.delete_appointment(appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return Response(status_code=204)
