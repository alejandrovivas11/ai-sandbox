from datetime import datetime, timedelta

import pytest
from fastapi import HTTPException
from jose import jwt
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.exc import IntegrityError

from app.auth import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.config import settings
from app.models.user import User
from app.schemas.user import (
    LoginRequest,
    Token,
    TokenData,
    UserCreate,
    UserResponse,
)


# ---------------------------------------------------------------------------
# User model tests
# ---------------------------------------------------------------------------


def test_user_model_has_correct_columns() -> None:
    """Verify User model has all required columns with correct types and constraints."""
    columns = {c.name: c for c in User.__table__.columns}

    assert "id" in columns
    assert isinstance(columns["id"].type, Integer)
    assert columns["id"].primary_key is True

    assert "email" in columns
    assert isinstance(columns["email"].type, String)
    assert columns["email"].type.length == 255
    assert columns["email"].unique is True
    assert columns["email"].nullable is False
    assert columns["email"].index is True

    assert "hashed_password" in columns
    assert isinstance(columns["hashed_password"].type, String)
    assert columns["hashed_password"].type.length == 255
    assert columns["hashed_password"].nullable is False

    assert "full_name" in columns
    assert isinstance(columns["full_name"].type, String)
    assert columns["full_name"].type.length == 255
    assert columns["full_name"].nullable is False

    assert "is_active" in columns
    assert isinstance(columns["is_active"].type, Boolean)

    assert "created_at" in columns
    assert isinstance(columns["created_at"].type, DateTime)


def test_user_model_email_unique_constraint(db_session) -> None:
    """Create two users with the same email and verify IntegrityError is raised."""
    user1 = User(
        email="dup@example.com",
        hashed_password="hash1",
        full_name="User One",
    )
    db_session.add(user1)
    db_session.commit()

    user2 = User(
        email="dup@example.com",
        hashed_password="hash2",
        full_name="User Two",
    )
    db_session.add(user2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


# ---------------------------------------------------------------------------
# Schema tests
# ---------------------------------------------------------------------------


def test_user_create_schema_validates_email() -> None:
    """Verify UserCreate rejects invalid emails and accepts valid ones."""
    valid = UserCreate(
        email="test@example.com", password="secret123", full_name="Test User"
    )
    assert valid.email == "test@example.com"

    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        UserCreate(email="not-an-email", password="secret123", full_name="Bad")


def test_user_create_schema_enforces_password_min_length() -> None:
    """Verify UserCreate rejects passwords shorter than 6 characters."""
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        UserCreate(email="a@b.com", password="short", full_name="Name")

    valid = UserCreate(email="a@b.com", password="123456", full_name="Name")
    assert valid.password == "123456"


def test_user_response_schema_from_attributes(db_session) -> None:
    """Verify UserResponse can be constructed from a User ORM instance."""
    user = User(
        email="orm@example.com",
        hashed_password="hashed",
        full_name="ORM User",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    response = UserResponse.from_orm(user)
    assert response.id == user.id
    assert response.email == "orm@example.com"
    assert response.full_name == "ORM User"
    assert response.is_active is True
    assert isinstance(response.created_at, datetime)


def test_token_and_token_data_schemas() -> None:
    """Verify Token and TokenData schemas accept correct fields."""
    token = Token(access_token="abc.def.ghi", token_type="bearer")
    assert token.access_token == "abc.def.ghi"
    assert token.token_type == "bearer"

    td_default = TokenData()
    assert td_default.email is None

    td_set = TokenData(email="user@example.com")
    assert td_set.email == "user@example.com"


def test_login_request_schema() -> None:
    """Verify LoginRequest schema accepts email and password."""
    lr = LoginRequest(email="user@example.com", password="pass123")
    assert lr.email == "user@example.com"
    assert lr.password == "pass123"


# ---------------------------------------------------------------------------
# Password hashing tests
# ---------------------------------------------------------------------------


def test_password_hashing_and_verification() -> None:
    """Verify bcrypt hashing and password verification."""
    password = "my_secret_password"
    hashed = get_password_hash(password)

    assert hashed != password
    assert hashed.startswith("$2")  # bcrypt hash prefix
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


# ---------------------------------------------------------------------------
# JWT token tests
# ---------------------------------------------------------------------------


def test_create_access_token_returns_valid_jwt() -> None:
    """Verify create_access_token returns a decodable JWT with correct claims."""
    token = create_access_token(data={"sub": "user@example.com"})
    payload = jwt.decode(
        token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
    )

    assert payload["sub"] == "user@example.com"
    assert "exp" in payload


def test_create_access_token_with_custom_expiry() -> None:
    """Verify create_access_token respects a custom expires_delta."""
    delta = timedelta(minutes=5)
    token = create_access_token(
        data={"sub": "user@example.com"}, expires_delta=delta
    )
    payload = jwt.decode(
        token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
    )

    exp_time = datetime.utcfromtimestamp(payload["exp"])
    expected = datetime.utcnow() + delta
    # Allow 10 seconds of clock drift
    assert abs((exp_time - expected).total_seconds()) < 10


# ---------------------------------------------------------------------------
# get_current_user dependency tests
# ---------------------------------------------------------------------------


def test_get_current_user_raises_401_for_invalid_token(db_session) -> None:
    """Call get_current_user with an invalid JWT and verify HTTP 401."""
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token="not.a.valid.jwt", db=db_session)
    assert exc_info.value.status_code == 401
    assert "Could not validate credentials" in exc_info.value.detail


def test_get_current_user_raises_401_for_expired_token(db_session) -> None:
    """Create a token with negative expiry and verify HTTP 401."""
    expired_token = create_access_token(
        data={"sub": "user@example.com"},
        expires_delta=timedelta(minutes=-1),
    )
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=expired_token, db=db_session)
    assert exc_info.value.status_code == 401


def test_get_current_user_raises_401_for_nonexistent_user(db_session) -> None:
    """Create a valid token for a non-existent user and verify HTTP 401."""
    token = create_access_token(data={"sub": "ghost@example.com"})
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token, db=db_session)
    assert exc_info.value.status_code == 401


def test_get_current_user_returns_user_for_valid_token(db_session) -> None:
    """Create a user, generate a valid token, and verify get_current_user works."""
    user = User(
        email="valid@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Valid User",
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(data={"sub": "valid@example.com"})
    result = get_current_user(token=token, db=db_session)

    assert result.id == user.id
    assert result.email == "valid@example.com"
    assert result.full_name == "Valid User"
