from sqlalchemy import Column, Integer, String, DateTime

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
