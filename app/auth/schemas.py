"""
Pydantic v2 schemas for authentication endpoints.
"""

import uuid

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Schema for login request body."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user data response."""

    id: uuid.UUID
    email: str
    full_name: str
    is_active: bool

    model_config = {"from_attributes": True}
