"""
SQLAlchemy declarative base and shared mixins.
"""

import uuid

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


class TimestampMixin:
    """Mixin providing id, created_at, and updated_at columns."""

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), nullable=True
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=True
    )
