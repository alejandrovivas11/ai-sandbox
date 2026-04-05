"""
SQLAlchemy Appointment model and status enum.
"""

import enum
import uuid

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AppointmentStatus(str, enum.Enum):
    """Valid appointment statuses."""

    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Appointment(Base):
    """Appointment model linking patients to scheduled visits."""

    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("patients.id"), index=True
    )
    appointment_date: Mapped[Date] = mapped_column(Date, index=True)
    appointment_time: Mapped[Time] = mapped_column(Time)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    status: Mapped[str] = mapped_column(String(20), default="scheduled")
    reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), nullable=True
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=True
    )

    patient = relationship("Patient", back_populates="appointments")
