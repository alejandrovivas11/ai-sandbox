"""
Appointment service layer for CRUD operations and business logic.
"""

import datetime
import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.appointments.models import Appointment, AppointmentStatus
from app.appointments.schemas import AppointmentCreate, AppointmentUpdate
from app.core.exceptions import NotFoundException, ValidationException
from app.patients.models import Patient

# Valid status transitions: current_status -> list of allowed next statuses
VALID_TRANSITIONS: dict[str, list[str]] = {
    AppointmentStatus.SCHEDULED.value: [
        AppointmentStatus.COMPLETED.value,
        AppointmentStatus.CANCELLED.value,
        AppointmentStatus.NO_SHOW.value,
    ],
    AppointmentStatus.COMPLETED.value: [],
    AppointmentStatus.CANCELLED.value: [],
    AppointmentStatus.NO_SHOW.value: [],
}


def create_appointment(db: Session, data: AppointmentCreate) -> Appointment:
    """Create a new appointment. Validates that the patient exists."""
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if patient is None:
        raise NotFoundException(detail="Patient not found")

    appointment = Appointment(
        id=uuid.uuid4(),
        patient_id=data.patient_id,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        duration_minutes=data.duration_minutes,
        status="scheduled",
        reason=data.reason,
        notes=data.notes,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def get_appointment(db: Session, appointment_id: uuid.UUID) -> Appointment:
    """Retrieve a single appointment by ID with patient eager-loaded."""
    appointment = (
        db.query(Appointment)
        .options(joinedload(Appointment.patient))
        .filter(Appointment.id == appointment_id)
        .first()
    )
    if appointment is None:
        raise NotFoundException(detail="Appointment not found")
    return appointment


def get_appointments(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    patient_id: uuid.UUID | None = None,
    status: str | None = None,
    date_from: datetime.date | None = None,
    date_to: datetime.date | None = None,
) -> tuple[list[Appointment], int]:
    """Retrieve paginated appointments with optional filters."""
    query = db.query(Appointment).options(joinedload(Appointment.patient))

    if patient_id is not None:
        query = query.filter(Appointment.patient_id == patient_id)
    if status is not None:
        query = query.filter(Appointment.status == status)
    if date_from is not None:
        query = query.filter(Appointment.appointment_date >= date_from)
    if date_to is not None:
        query = query.filter(Appointment.appointment_date <= date_to)

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, total


def update_appointment(
    db: Session, appointment_id: uuid.UUID, data: AppointmentUpdate
) -> Appointment:
    """Update an existing appointment. Only non-None fields are updated."""
    appointment = get_appointment(db, appointment_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
    db.commit()
    db.refresh(appointment)
    return appointment


def update_status(
    db: Session, appointment_id: uuid.UUID, new_status: str
) -> Appointment:
    """Update appointment status with transition validation."""
    appointment = get_appointment(db, appointment_id)
    current_status = appointment.status

    allowed = VALID_TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        raise ValidationException(
            detail=f"Cannot transition from '{current_status}' to '{new_status}'"
        )

    appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    return appointment


def delete_appointment(db: Session, appointment_id: uuid.UUID) -> None:
    """Delete an appointment by ID."""
    appointment = get_appointment(db, appointment_id)
    db.delete(appointment)
    db.commit()


def get_calendar_data(
    db: Session, year: int, month: int
) -> list[dict]:
    """Get appointment counts grouped by date for a given month."""
    start_date = datetime.date(year, month, 1)
    if month == 12:
        end_date = datetime.date(year + 1, 1, 1)
    else:
        end_date = datetime.date(year, month + 1, 1)

    results = (
        db.query(
            Appointment.appointment_date,
            func.count(Appointment.id).label("count"),
        )
        .filter(
            Appointment.appointment_date >= start_date,
            Appointment.appointment_date < end_date,
        )
        .group_by(Appointment.appointment_date)
        .all()
    )

    return [{"date": row[0], "count": row[1]} for row in results]
