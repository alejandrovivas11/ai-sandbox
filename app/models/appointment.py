"""Pydantic v2 models for Appointment CRUD operations."""

from datetime import datetime as dt_type
from enum import Enum

from pydantic import BaseModel, ConfigDict


class AppointmentStatus(str, Enum):
    """Valid appointment statuses."""

    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


# Valid status transitions: current_status -> set of allowed target statuses.
VALID_STATUS_TRANSITIONS: dict[str, set[str]] = {
    "scheduled": {"completed", "cancelled"},
    "completed": set(),
    "cancelled": set(),
}


class AppointmentCreate(BaseModel):
    """Schema for creating a new appointment."""

    patient_id: int
    doctor_name: str
    datetime: dt_type
    status: AppointmentStatus = AppointmentStatus.scheduled
    notes: str = ""


class AppointmentUpdate(BaseModel):
    """Schema for partially updating an existing appointment."""

    patient_id: int | None = None
    doctor_name: str | None = None
    datetime: dt_type | None = None
    status: AppointmentStatus | None = None
    notes: str | None = None


class AppointmentResponse(BaseModel):
    """Schema for appointment responses including server-generated fields."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int
    doctor_name: str
    datetime: dt_type
    status: AppointmentStatus
    notes: str
    created_at: dt_type
    updated_at: dt_type
