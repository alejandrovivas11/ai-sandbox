"""Shared test fixtures for the staff management application."""

import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.schemas.staff import StaffCreate

# Use an in-memory SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db():
    """Provide a clean database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db):
    """Provide a TestClient that uses the test database session."""

    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def sample_staff_data():
    """Return sample staff data as a dictionary (for API calls)."""
    return {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "role": "Engineer",
        "team": "Backend",
        "status": "active",
        "hire_date": "2024-01-15",
    }


@pytest.fixture()
def sample_staff_create():
    """Return a StaffCreate schema instance (for CRUD calls)."""
    return StaffCreate(
        name="Alice Johnson",
        email="alice@example.com",
        role="Engineer",
        team="Backend",
        status="active",
        hire_date=datetime.date(2024, 1, 15),
    )
