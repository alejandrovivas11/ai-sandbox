from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class StaffCreate(BaseModel):
    """Schema for creating a new staff member."""

    name: str
    role: str
    department: str
    email: str
    phone: Optional[str] = None
    status: str = "Active"
    hireDate: Optional[datetime] = None


class StaffUpdate(BaseModel):
    """Schema for updating an existing staff member. All fields optional."""

    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    hireDate: Optional[datetime] = None


class StaffResponse(BaseModel):
    """Schema for returning staff member data."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    department: str
    email: str
    phone: Optional[str] = None
    status: str
    hireDate: Optional[datetime] = None
