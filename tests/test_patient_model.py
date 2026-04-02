import datetime

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.patient import Patient


def test_patient_table_name() -> None:
    """Verify Patient.__tablename__ equals 'patients'."""
    assert Patient.__tablename__ == "patients"


def test_patient_columns_exist() -> None:
    """Verify all expected columns exist in the Patient model."""
    columns = {c.name for c in Patient.__table__.columns}
    expected = {
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "date_of_birth",
        "medical_history",
        "created_at",
        "updated_at",
    }
    assert expected.issubset(columns)


def test_patient_email_unique_constraint(db_session) -> None:
    """Verify that inserting two patients with the same email raises IntegrityError."""
    p1 = Patient(
        first_name="John",
        last_name="Doe",
        email="john@example.com",
        date_of_birth=datetime.date(1990, 1, 1),
    )
    p2 = Patient(
        first_name="Jane",
        last_name="Doe",
        email="john@example.com",
        date_of_birth=datetime.date(1991, 2, 2),
    )
    db_session.add(p1)
    db_session.commit()
    db_session.add(p2)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_patient_create_and_persist(db_session) -> None:
    """Create a Patient, add to session, commit, and verify query results."""
    patient = Patient(
        first_name="Alice",
        last_name="Smith",
        email="alice@example.com",
        phone="555-0100",
        date_of_birth=datetime.date(1985, 6, 15),
        medical_history="No known allergies",
    )
    db_session.add(patient)
    db_session.commit()

    result = db_session.query(Patient).filter_by(email="alice@example.com").first()
    assert result is not None
    assert result.first_name == "Alice"
    assert result.last_name == "Smith"
    assert result.phone == "555-0100"
    assert result.date_of_birth == datetime.date(1985, 6, 15)
    assert result.medical_history == "No known allergies"


def test_patient_created_at_default(db_session) -> None:
    """Verify that created_at is automatically populated on creation."""
    patient = Patient(
        first_name="Bob",
        last_name="Jones",
        date_of_birth=datetime.date(2000, 3, 20),
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    assert patient.created_at is not None
    assert isinstance(patient.created_at, datetime.datetime)


def test_patient_medical_history_default(db_session) -> None:
    """Verify that medical_history defaults to empty string when not provided."""
    patient = Patient(
        first_name="Carol",
        last_name="White",
        date_of_birth=datetime.date(1975, 12, 1),
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    assert patient.medical_history == ""
