"""Test configuration and fixtures.

Defines a stub Appointment model so that the Patient.appointments
relationship can be resolved by SQLAlchemy during tests. The real
Appointment model will be defined in a future task.
"""

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Appointment(Base):
    """Minimal stub for the Appointment model used in relationship tests."""

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    reason = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="appointments")
