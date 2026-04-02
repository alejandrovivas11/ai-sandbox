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
    password: str = Field(min_length=8)


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
