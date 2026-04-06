"""Pydantic v2 models for Appointment CRUD operations."""

from typing import Optional

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    """Schema for creating a new appointment."""

    patient_id: str
    doctor_name: str
    datetime: str
    status: str = "scheduled"
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    """Schema for partially updating an existing appointment."""

    patient_id: Optional[str] = None
    doctor_name: Optional[str] = None
    datetime: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    """Schema for appointment responses including server-generated fields."""

    id: str
    patient_id: str
    doctor_name: str
    datetime: str
    status: str
    notes: Optional[str] = None
    created_at: str
    updated_at: str
