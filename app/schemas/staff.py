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
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    employee_id: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    work_location: Optional[str] = None
    pay_type: Optional[str] = None
    pay_rate: Optional[float] = None
    pay_frequency: Optional[str] = None
    benefits_enrolled: Optional[str] = None
    earnings: Optional[float] = None
    clients_count: Optional[int] = None
    utilized_hours: Optional[float] = None
    cancelled_hours: Optional[float] = None


class StaffUpdate(BaseModel):
    """Schema for updating an existing staff member. All fields optional."""

    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    hireDate: Optional[datetime] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    employee_id: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    work_location: Optional[str] = None
    pay_type: Optional[str] = None
    pay_rate: Optional[float] = None
    pay_frequency: Optional[str] = None
    benefits_enrolled: Optional[str] = None
    earnings: Optional[float] = None
    clients_count: Optional[int] = None
    utilized_hours: Optional[float] = None
    cancelled_hours: Optional[float] = None


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
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    employee_id: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    work_location: Optional[str] = None
    pay_type: Optional[str] = None
    pay_rate: Optional[float] = None
    pay_frequency: Optional[str] = None
    benefits_enrolled: Optional[str] = None
    earnings: Optional[float] = None
    clients_count: Optional[int] = None
    utilized_hours: Optional[float] = None
    cancelled_hours: Optional[float] = None
