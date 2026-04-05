"""
Pydantic v2 schemas for patient endpoints.
"""

import datetime
import uuid

from pydantic import BaseModel


class PatientCreate(BaseModel):
    """Schema for creating a new patient."""

    first_name: str
    last_name: str
    date_of_birth: datetime.date
    gender: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None


class PatientUpdate(BaseModel):
    """Schema for updating a patient. All fields are optional."""

    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: datetime.date | None = None
    gender: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None


class PatientResponse(BaseModel):
    """Schema for patient response data."""

    id: uuid.UUID
    first_name: str
    last_name: str
    date_of_birth: datetime.date
    gender: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None

    model_config = {"from_attributes": True}
