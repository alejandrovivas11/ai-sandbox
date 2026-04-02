from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


# --- Patient schemas ---


class PatientCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    date_of_birth: date | None = None
    phone_number: str | None = None
    address: str | None = None


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    phone_number: str | None = None
    address: str | None = None


class PatientResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    email: str
    first_name: str
    last_name: str
    date_of_birth: date | None = None
    phone_number: str | None = None
    address: str | None = None
    created_at: datetime


# --- Appointment schemas ---


class AppointmentCreate(BaseModel):
    appointment_date: datetime
    reason: str
    doctor_name: str | None = None
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    appointment_date: datetime | None = None
    reason: str | None = None
    status: str | None = None
    doctor_name: str | None = None
    notes: str | None = None


class AppointmentResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    patient_id: int
    appointment_date: datetime
    reason: str
    status: str
    doctor_name: str | None = None
    notes: str | None = None
    created_at: datetime


# --- Auth schemas ---


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: str
    password: str
