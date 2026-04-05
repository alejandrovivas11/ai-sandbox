"""
Authentication service layer for user management.
"""

import uuid

from sqlalchemy.orm import Session

from app.auth.models import User
from app.auth.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    """Retrieve a user by email address."""
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate a user by email and password. Returns User or None."""
    user = get_user_by_email(db, email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(
    db: Session, email: str, password: str, full_name: str
) -> User:
    """Create a new user with a hashed password."""
    user = User(
        id=uuid.uuid4(),
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
