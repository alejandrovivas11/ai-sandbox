"""Pydantic v2 models for Patient CRUD operations."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class PatientCreate(BaseModel):
    """Schema for creating a new patient."""

    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    phone_number: str
    email: str | None = None
    address: str | None = None


class PatientUpdate(BaseModel):
    """Schema for partially updating an existing patient."""

    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    phone_number: str | None = None
    email: str | None = None
    address: str | None = None


class PatientResponse(BaseModel):
    """Schema for patient responses including server-generated fields."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    phone_number: str
    email: str | None = None
    address: str | None = None
    created_at: datetime
    updated_at: datetime
