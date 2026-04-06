"""Pydantic v2 models for Patient CRUD operations.

Uses a single 'name' field instead of the legacy 'first_name' / 'last_name'
pair.  A model validator provides backward compatibility by mapping legacy
field names when they appear in incoming data.
"""

import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class PatientCreate(BaseModel):
    """Schema for creating a new patient."""

    model_config = ConfigDict(extra="ignore")

    name: str
    email: str
    phone: str
    date_of_birth: date

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_fields(cls, data: object) -> object:
        """Map legacy first_name/last_name to name, phone_number to phone."""
        if not isinstance(data, dict):
            return data
        if "name" not in data and ("first_name" in data or "last_name" in data):
            fn = data.get("first_name", "")
            ln = data.get("last_name", "")
            data["name"] = f"{fn} {ln}".strip()
        if "phone" not in data and "phone_number" in data:
            data["phone"] = data["phone_number"]
        return data

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Reject values that do not look like an email address."""
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v):
            raise ValueError("invalid email format")
        return v


class PatientUpdate(BaseModel):
    """Schema for partially updating an existing patient."""

    model_config = ConfigDict(extra="ignore")

    name: str | None = None
    email: str | None = None
    phone: str | None = None
    date_of_birth: date | None = None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_fields(cls, data: object) -> object:
        """Map legacy first_name/last_name to name, phone_number to phone."""
        if not isinstance(data, dict):
            return data
        if "name" not in data and ("first_name" in data or "last_name" in data):
            fn = data.get("first_name", "")
            ln = data.get("last_name", "")
            data["name"] = f"{fn} {ln}".strip()
        if "phone" not in data and "phone_number" in data:
            data["phone"] = data["phone_number"]
        return data

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str | None) -> str | None:
        """Reject values that do not look like an email address."""
        if v is not None and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v):
            raise ValueError("invalid email format")
        return v


class PatientResponse(BaseModel):
    """Schema for patient responses including server-generated fields."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str | None = None
    phone: str
    date_of_birth: date
    created_at: datetime
    updated_at: datetime
