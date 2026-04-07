"""Pydantic models for Staff management."""

from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field


class StaffStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"


class PayrollStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"


class StaffBase(BaseModel):
    """Base model with shared staff fields."""

    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    status: StaffStatus = StaffStatus.ACTIVE
    role: str = Field(..., min_length=1, max_length=200)
    department: str = Field(default="", max_length=200)
    teams: List[str] = Field(default_factory=list)
    payroll_status: PayrollStatus = PayrollStatus.ACTIVE


class StaffCreate(StaffBase):
    """Model for creating a new staff member."""

    pass


class StaffUpdate(BaseModel):
    """Model for updating a staff member. All fields optional."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    email: Optional[EmailStr] = None
    status: Optional[StaffStatus] = None
    role: Optional[str] = Field(default=None, min_length=1, max_length=200)
    department: Optional[str] = Field(default=None, max_length=200)
    teams: Optional[List[str]] = None
    payroll_status: Optional[PayrollStatus] = None


class Staff(StaffBase):
    """Full staff model with ID."""

    id: UUID = Field(default_factory=uuid4)

    model_config = {"from_attributes": True}
