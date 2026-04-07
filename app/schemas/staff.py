import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class StaffBase(BaseModel):
    name: str
    email: str
    role: str
    team: str
    status: str = "active"
    hire_date: datetime.date


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    team: Optional[str] = None
    status: Optional[str] = None
    hire_date: Optional[datetime.date] = None


class StaffResponse(StaffBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
