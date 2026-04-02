import os

# Set required environment variables before any application imports.
# SECRET_KEY must be present or the Settings class will refuse to initialise.
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app

# ---------------------------------------------------------------------------
# In-memory SQLite engine shared across database-aware fixtures
# ---------------------------------------------------------------------------
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_patient_portal.db"

_test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=_test_engine
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture()
def client():
    """Plain test client without database overrides."""
    return TestClient(app)


@pytest.fixture()
def db_session():
    """Yield a clean database session; tables are created before the test
    and dropped afterwards so each test starts with a blank slate."""
    Base.metadata.create_all(bind=_test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=_test_engine)


@pytest.fixture()
def client_with_db(db_session):
    """Test client whose ``get_db`` dependency is overridden with the
    test-scoped *db_session* fixture."""

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
