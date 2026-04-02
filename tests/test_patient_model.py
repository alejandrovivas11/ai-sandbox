from datetime import date

import pytest
from sqlalchemy.exc import IntegrityError

from app.models import Patient


def test_patient_model_has_correct_tablename() -> None:
    """Verify that Patient.__tablename__ equals 'patients'."""
    assert Patient.__tablename__ == "patients"


def test_patient_model_has_all_columns() -> None:
    """Verify that Patient model has all 10 required columns."""
    column_names = {c.name for c in Patient.__table__.columns}
    expected = {
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
    assert expected == column_names


def test_patient_email_column_is_unique() -> None:
    """Verify that the email column has unique=True."""
    email_col = Patient.__table__.columns["email"]
    assert email_col.unique is True


def test_patient_email_column_is_indexed() -> None:
    """Verify that the email column has index=True."""
    email_col = Patient.__table__.columns["email"]
    assert email_col.index is True


def test_patient_model_has_appointments_relationship() -> None:
    """Verify that Patient has an 'appointments' relationship attribute."""
    assert hasattr(Patient, "appointments")


def test_patient_create_and_read_in_db(db) -> None:
    """Create a Patient, commit, query it back, and verify all fields."""
    patient = Patient(
        email="test@example.com",
        hashed_password="hashed_pw_123",
        first_name="Jane",
        last_name="Doe",
        date_of_birth=date(1990, 5, 15),
        phone_number="555-0100",
        address="123 Main St",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    fetched = db.query(Patient).filter(Patient.email == "test@example.com").first()
    assert fetched is not None
    assert fetched.email == "test@example.com"
    assert fetched.hashed_password == "hashed_pw_123"
    assert fetched.first_name == "Jane"
    assert fetched.last_name == "Doe"
    assert fetched.date_of_birth == date(1990, 5, 15)
    assert fetched.phone_number == "555-0100"
    assert fetched.address == "123 Main St"
    assert fetched.created_at is not None
    assert fetched.updated_at is not None


def test_patient_email_unique_constraint_in_db(db) -> None:
    """Verify that inserting two patients with the same email raises IntegrityError."""
    patient1 = Patient(
        email="duplicate@example.com",
        hashed_password="hashed_pw_1",
        first_name="Alice",
        last_name="Smith",
    )
    db.add(patient1)
    db.commit()

    patient2 = Patient(
        email="duplicate@example.com",
        hashed_password="hashed_pw_2",
        first_name="Bob",
        last_name="Jones",
    )
    db.add(patient2)
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()


def test_status_endpoint_still_works(client) -> None:
    """Send GET /status and verify it returns 200 with expected fields."""
    response = client.get("/status")
    assert response.status_code == 200
    data = response.json()
    assert "app_name" in data
    assert "version" in data
    assert "status" in data
    assert "timestamp" in data
