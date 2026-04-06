"""Pydantic models for Patient CRUD operations."""

from typing import Optional

from pydantic import BaseModel


class PatientCreate(BaseModel):
    """Schema for creating a new patient."""

    name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None


class PatientUpdate(BaseModel):
    """Schema for partially updating an existing patient."""

    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None


class PatientResponse(BaseModel):
    """Schema for patient responses including server-generated fields."""

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    created_at: str
    updated_at: str
