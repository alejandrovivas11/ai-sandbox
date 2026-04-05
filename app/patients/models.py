"""
SQLAlchemy Patient model.
"""

import uuid

from sqlalchemy import Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Patient(Base):
    """Patient model storing demographic and contact information."""

    __tablename__ = "patients"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    date_of_birth: Mapped[Date] = mapped_column(Date)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), nullable=True
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=True
    )

    appointments = relationship(
        "Appointment", back_populates="patient", cascade="all, delete-orphan"
    )
