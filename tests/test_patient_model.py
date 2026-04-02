from datetime import date, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Patient, StatusResponse


@pytest.fixture()
def db_session():
    """Create an in-memory SQLite database session for testing."""
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    testing_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = testing_session()
    try:
        yield session
    finally:
        session.close()


def test_patient_model_has_correct_tablename() -> None:
    """Verify that Patient.__tablename__ equals 'patients'."""
    assert Patient.__tablename__ == "patients"


def test_patient_model_has_all_columns() -> None:
    """Verify that Patient model has all 10 required columns."""
    expected_columns = {
        "id",
        "email",
        "hashed_password",
        "first_name",
        "last_name",
        "date_of_birth",
        "phone_number",
        "address",
        "created_at",
        "updated_at",
    }
    actual_columns = {col.name for col in Patient.__table__.columns}
    assert expected_columns == actual_columns


def test_patient_email_column_is_unique() -> None:
    """Verify that the email column has unique=True."""
    email_col = Patient.__table__.columns["email"]
    assert email_col.unique is True


def test_patient_model_has_appointments_relationship() -> None:
    """Verify that Patient has an 'appointments' relationship attribute."""
    from sqlalchemy.orm.relationships import RelationshipProperty

    # Check mapper properties directly to avoid triggering full configuration,
    # since the Appointment model is not yet defined in this codebase.
    props = Patient.__mapper__._props
    assert "appointments" in props
    assert isinstance(props["appointments"], RelationshipProperty)


def test_patient_create_and_read_in_db(db_session) -> None:
    """Create a Patient instance, commit it, query it back, and verify fields."""
    patient = Patient(
        email="test@example.com",
        hashed_password="hashed_abc123",
        first_name="Jane",
        last_name="Doe",
        date_of_birth=date(1990, 5, 15),
        phone_number="555-0100",
        address="123 Main St",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    queried = db_session.query(Patient).filter_by(email="test@example.com").first()
    assert queried is not None
    assert queried.email == "test@example.com"
    assert queried.hashed_password == "hashed_abc123"
    assert queried.first_name == "Jane"
    assert queried.last_name == "Doe"
    assert queried.date_of_birth == date(1990, 5, 15)
    assert queried.phone_number == "555-0100"
    assert queried.address == "123 Main St"
    assert queried.id is not None
    assert isinstance(queried.created_at, datetime)
    assert isinstance(queried.updated_at, datetime)


def test_status_endpoint_still_works() -> None:
    """Send GET /status and verify it returns 200 with expected fields."""
    from app.main import app

    client = TestClient(app)
    response = client.get("/status")
    assert response.status_code == 200
    data = response.json()
    assert "app_name" in data
    assert "version" in data
    assert "status" in data
    assert "timestamp" in data
    assert data["status"] == "operational"
