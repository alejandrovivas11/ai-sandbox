"""
Pydantic v2 schemas for appointment endpoints.
"""

import datetime
import uuid

from pydantic import BaseModel

from app.appointments.models import AppointmentStatus


class AppointmentCreate(BaseModel):
    """Schema for creating a new appointment."""

    patient_id: uuid.UUID
    appointment_date: datetime.date
    appointment_time: datetime.time
    duration_minutes: int = 30
    reason: str | None = None
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment. All fields optional."""

    patient_id: uuid.UUID | None = None
    appointment_date: datetime.date | None = None
    appointment_time: datetime.time | None = None
    duration_minutes: int | None = None
    reason: str | None = None
    notes: str | None = None


class StatusUpdate(BaseModel):
    """Schema for updating appointment status."""

    status: AppointmentStatus


class AppointmentResponse(BaseModel):
    """Schema for appointment response data."""

    id: uuid.UUID
    patient_id: uuid.UUID
    appointment_date: datetime.date
    appointment_time: datetime.time
    duration_minutes: int
    status: str
    reason: str | None = None
    notes: str | None = None
    patient_name: str | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None

    model_config = {"from_attributes": True}


class CalendarDay(BaseModel):
    """Schema for a single day in the calendar view."""

    date: datetime.date
    count: int


class CalendarResponse(BaseModel):
    """Schema for the calendar endpoint response."""

    days: list[CalendarDay]
