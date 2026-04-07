from sqlalchemy import Column, Integer, String, DateTime, Float

from app.database import Base


class Staff(Base):
    """SQLAlchemy model for staff members."""

    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    department = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Active")
    hireDate = Column(DateTime, nullable=True)
    # Personal Information
    address = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    # Employment Details
    employee_id = Column(String, nullable=True, unique=True)
    position = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    work_location = Column(String, nullable=True)
    # Compensation & Benefits
    pay_type = Column(String, nullable=True)
    pay_rate = Column(Float, nullable=True)
    pay_frequency = Column(String, nullable=True)
    benefits_enrolled = Column(String, nullable=True)
    # Overview Metrics
    earnings = Column(Float, nullable=True, default=0.0)
    clients_count = Column(Integer, nullable=True, default=0)
    utilized_hours = Column(Float, nullable=True, default=0.0)
    cancelled_hours = Column(Float, nullable=True, default=0.0)
