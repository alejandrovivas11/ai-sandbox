import enum
from datetime import datetime, timezone

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class StatusResponse(BaseModel):
    app_name: str
    version: str
    status: str
    timestamp: datetime


# ---------------------------------------------------------------------------
# SQLAlchemy enums
# ---------------------------------------------------------------------------

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ---------------------------------------------------------------------------
# SQLAlchemy models
# ---------------------------------------------------------------------------

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    appointments = relationship("Appointment", back_populates="patient")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(
        String,
        default=AppointmentStatus.SCHEDULED.value,
        nullable=False,
    )
    doctor_name = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    patient = relationship("Patient", back_populates="appointments")
