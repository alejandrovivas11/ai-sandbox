"""
Shared Pydantic v2 schemas used across the application.
"""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""

    items: list[T]
    total: int
    page: int
    page_size: int


class MessageResponse(BaseModel):
    """Simple message response."""

    message: str
