from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PatientBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    date_of_birth: date | None = None
    phone_number: str | None = None
    address: str | None = None


class PatientCreate(PatientBase):
    """Schema for creating a new patient.

    The ``password`` field accepts a plaintext password that MUST be hashed
    (e.g. via bcrypt) before being persisted to the database.  It is marked
    ``repr=False`` so that it is excluded from string representations and
    will not appear in logs or error messages.
    """

    password: str = Field(
        min_length=8,
        max_length=128,
        repr=False,
        description=(
            "Plaintext password. Must be hashed before storage. "
            "Never log or return this value in API responses."
        ),
    )


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    phone_number: str | None = None
    address: str | None = None


class PatientResponse(PatientBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PatientListResponse(BaseModel):
    patients: list[PatientResponse]
    total: int
