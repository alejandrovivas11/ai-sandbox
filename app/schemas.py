from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# --- Patient schemas ---


class PatientCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None


class PatientResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    email: str
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime


# --- Appointment schemas ---


class AppointmentCreate(BaseModel):
    appointment_date: datetime
    reason: str
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    reason: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    appointment_date: datetime
    reason: str
    notes: Optional[str] = None
    created_at: datetime


# --- Auth schemas ---


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
