from datetime import date

import pytest
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError

from app.models.patient import Patient


def test_patient_table_created_with_all_columns(db_session):
    """Verify that the 'patients' table exists with all 11 expected columns."""
    inspector = inspect(db_session.bind)
    columns = inspector.get_columns("patients")
    column_names = {col["name"] for col in columns}

    expected = {
        "id",
        "email",
        "hashed_password",
        "first_name",
        "last_name",
        "date_of_birth",
        "phone_number",
        "address",
        "is_active",
        "created_at",
        "updated_at",
    }
    assert expected == column_names


def test_patient_email_unique_constraint(db_session):
    """Insert two patients with the same email and verify IntegrityError."""
    patient1 = Patient(
        email="duplicate@example.com",
        hashed_password="hashedpw1",
        first_name="Alice",
        last_name="Smith",
    )
    patient2 = Patient(
        email="duplicate@example.com",
        hashed_password="hashedpw2",
        first_name="Bob",
        last_name="Jones",
    )
    db_session.add(patient1)
    db_session.commit()

    db_session.add(patient2)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_patient_email_column_is_indexed(db_session):
    """Inspect the email column on Patient and verify index=True."""
    email_col = Patient.__table__.columns["email"]
    assert email_col.index is True


def test_patient_default_values(db_session):
    """Create a Patient without is_active/created_at/updated_at and verify defaults."""
    patient = Patient(
        email="defaults@example.com",
        hashed_password="hashedpw",
        first_name="Jane",
        last_name="Doe",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    assert patient.is_active is True
    assert patient.created_at is not None
    assert patient.updated_at is not None


def test_patient_persist_and_retrieve(db_session):
    """Create, commit, and query back a Patient; verify all fields match."""
    patient = Patient(
        email="persist@example.com",
        hashed_password="hashedpw",
        first_name="John",
        last_name="Doe",
        date_of_birth=date(1990, 5, 15),
        phone_number="555-0100",
        address="123 Main St",
    )
    db_session.add(patient)
    db_session.commit()

    retrieved = db_session.query(Patient).filter_by(email="persist@example.com").first()
    assert retrieved is not None
    assert retrieved.id is not None
    assert retrieved.email == "persist@example.com"
    assert retrieved.hashed_password == "hashedpw"
    assert retrieved.first_name == "John"
    assert retrieved.last_name == "Doe"
    assert retrieved.date_of_birth == date(1990, 5, 15)
    assert retrieved.phone_number == "555-0100"
    assert retrieved.address == "123 Main St"
    assert retrieved.is_active is True
    assert retrieved.created_at is not None
    assert retrieved.updated_at is not None
