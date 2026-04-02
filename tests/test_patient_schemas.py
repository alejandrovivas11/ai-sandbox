from datetime import date, datetime

import pytest
from pydantic import ValidationError

from app.models.patient import Patient
from app.schemas.patient import (
    PatientCreate,
    PatientListResponse,
    PatientResponse,
    PatientUpdate,
)


def test_patient_create_valid():
    """Verify PatientCreate accepts valid data with password >= 8 characters."""
    data = {
        "email": "valid@example.com",
        "first_name": "Alice",
        "last_name": "Smith",
        "password": "securepass",
    }
    schema = PatientCreate(**data)
    assert schema.email == "valid@example.com"
    assert schema.first_name == "Alice"
    assert schema.last_name == "Smith"
    assert schema.password == "securepass"


def test_patient_create_password_too_short():
    """Verify PatientCreate raises ValidationError for password < 8 characters."""
    data = {
        "email": "short@example.com",
        "first_name": "Alice",
        "last_name": "Smith",
        "password": "short",
    }
    with pytest.raises(ValidationError) as exc_info:
        PatientCreate(**data)
    assert "password" in str(exc_info.value).lower()


def test_patient_create_missing_required_fields():
    """Verify PatientCreate raises ValidationError when required fields are missing."""
    with pytest.raises(ValidationError):
        PatientCreate(password="securepass")

    with pytest.raises(ValidationError):
        PatientCreate(
            email="test@example.com",
            password="securepass",
        )


def test_patient_update_all_fields_optional():
    """Verify PatientUpdate accepts empty dict and partial updates."""
    empty = PatientUpdate()
    assert empty.first_name is None
    assert empty.last_name is None
    assert empty.date_of_birth is None
    assert empty.phone_number is None
    assert empty.address is None

    partial = PatientUpdate(first_name="Updated")
    assert partial.first_name == "Updated"
    assert partial.last_name is None


def test_patient_response_from_orm_object(db_session):
    """Create a Patient ORM instance and verify PatientResponse serializes it."""
    patient = Patient(
        email="orm@example.com",
        hashed_password="hashedpw",
        first_name="Jane",
        last_name="Doe",
        date_of_birth=date(1985, 3, 20),
        phone_number="555-0200",
        address="456 Oak Ave",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    response = PatientResponse.model_validate(patient)
    assert response.id == patient.id
    assert response.email == "orm@example.com"
    assert response.first_name == "Jane"
    assert response.last_name == "Doe"
    assert response.date_of_birth == date(1985, 3, 20)
    assert response.phone_number == "555-0200"
    assert response.address == "456 Oak Ave"
    assert response.is_active is True
    assert isinstance(response.created_at, datetime)
    assert isinstance(response.updated_at, datetime)


def test_patient_list_response_structure(db_session):
    """Verify PatientListResponse accepts a list of PatientResponse and a total."""
    patient = Patient(
        email="list@example.com",
        hashed_password="hashedpw",
        first_name="Bob",
        last_name="Brown",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    patient_resp = PatientResponse.model_validate(patient)
    list_resp = PatientListResponse(patients=[patient_resp], total=1)

    assert len(list_resp.patients) == 1
    assert list_resp.total == 1
    assert list_resp.patients[0].email == "list@example.com"
