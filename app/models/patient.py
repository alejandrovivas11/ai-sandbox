from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class Patient(Base):
    """Patient model for the patients table.

    Note: The hashed_password field stores a bcrypt hash and must never be
    included in API responses or application logs.  A forward reference to a
    future Appointment model can be added via ``relationship("Appointment")``
    once that model is implemented.
    """

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)

    # Stores the bcrypt-hashed password. Never expose in responses or logs.
    hashed_password = Column(String(255), nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        """Return a string representation that excludes sensitive fields."""
        return f"<Patient(id={self.id}, email={self.email!r})>"
