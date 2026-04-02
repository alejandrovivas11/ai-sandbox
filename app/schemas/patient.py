from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class PatientBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: date
    medical_history: Optional[str] = ""


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    medical_history: Optional[str] = None


class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PatientListResponse(BaseModel):
    patients: List[PatientResponse]
    total: int
    page: int
    per_page: int
