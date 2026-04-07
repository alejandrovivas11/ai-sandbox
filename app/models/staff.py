import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime
from app.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(String, nullable=False)
    team = Column(String, nullable=False)
    status = Column(String, nullable=False, default="active")
    hire_date = Column(Date, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=datetime.datetime.utcnow
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )
