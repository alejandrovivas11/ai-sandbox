"""
Appointment CRUD and status management routes.
"""

import datetime
import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.appointments.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
    CalendarResponse,
    StatusUpdate,
)
from app.appointments.service import (
    create_appointment,
    delete_appointment,
    get_appointment,
    get_appointments,
    get_calendar_data,
    update_appointment,
    update_status,
)
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.core.schemas import PaginatedResponse
from app.db.dependencies import get_db

router = APIRouter(prefix="/appointments", tags=["appointments"])


def _to_response(appointment) -> AppointmentResponse:
    """Convert an Appointment ORM object to an AppointmentResponse."""
    patient_name = None
    if appointment.patient is not None:
        patient_name = (
            f"{appointment.patient.first_name} {appointment.patient.last_name}"
        )
    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        duration_minutes=appointment.duration_minutes,
        status=appointment.status,
        reason=appointment.reason,
        notes=appointment.notes,
        patient_name=patient_name,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at,
    )


@router.get("", response_model=PaginatedResponse[AppointmentResponse])
def list_appointments(
    page: int = 1,
    page_size: int = 10,
    patient_id: uuid.UUID | None = None,
    status_filter: str | None = None,
    date_from: datetime.date | None = None,
    date_to: datetime.date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """List appointments with optional filters and pagination."""
    items, total = get_appointments(
        db,
        page=page,
        page_size=page_size,
        patient_id=patient_id,
        status=status_filter,
        date_from=date_from,
        date_to=date_to,
    )
    return {
        "items": [_to_response(item) for item in items],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/calendar", response_model=CalendarResponse)
def get_calendar(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CalendarResponse:
    """Get appointment counts grouped by date for a given month."""
    days = get_calendar_data(db, year, month)
    return CalendarResponse(days=days)


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment_endpoint(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentResponse:
    """Create a new appointment."""
    appointment = create_appointment(db, data)
    # Reload with patient relationship
    appointment = get_appointment(db, appointment.id)
    return _to_response(appointment)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment_endpoint(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentResponse:
    """Retrieve a single appointment by ID."""
    appointment = get_appointment(db, appointment_id)
    return _to_response(appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment_endpoint(
    appointment_id: uuid.UUID,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentResponse:
    """Update an existing appointment."""
    appointment = update_appointment(db, appointment_id, data)
    return _to_response(appointment)


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: uuid.UUID,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentResponse:
    """Update appointment status with transition validation."""
    appointment = update_status(db, appointment_id, data.status.value)
    return _to_response(appointment)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment_endpoint(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete an appointment by ID."""
    delete_appointment(db, appointment_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
