"""Pydantic v2 models for Appointment CRUD operations."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class AppointmentStatus(str, Enum):
    """Valid appointment statuses."""

    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class AppointmentCreate(BaseModel):
    """Schema for creating a new appointment."""

    patient_id: str
    date_time: datetime
    appointment_type: str
    status: AppointmentStatus = AppointmentStatus.scheduled
    duration_minutes: int = 30


class AppointmentUpdate(BaseModel):
    """Schema for partially updating an existing appointment."""

    patient_id: str | None = None
    date_time: datetime | None = None
    appointment_type: str | None = None
    status: AppointmentStatus | None = None
    duration_minutes: int | None = None


class AppointmentResponse(BaseModel):
    """Schema for appointment responses including server-generated fields."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    date_time: datetime
    appointment_type: str
    status: AppointmentStatus
    duration_minutes: int
    created_at: datetime
    updated_at: datetime
