import datetime
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.schemas.patient import (
    PatientBase,
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientListResponse,
)


def _valid_patient_data() -> dict:
    """Return a dict with valid data for PatientBase."""
    return {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "555-0100",
        "date_of_birth": datetime.date(1990, 1, 1),
        "medical_history": "None",
    }


def test_patient_base_valid_data() -> None:
    """Verify PatientBase accepts valid data with all required fields."""
    data = _valid_patient_data()
    patient = PatientBase(**data)
    assert patient.first_name == "John"
    assert patient.last_name == "Doe"
    assert patient.email == "john@example.com"
    assert patient.date_of_birth == datetime.date(1990, 1, 1)


def test_patient_base_rejects_missing_required_fields() -> None:
    """Verify PatientBase raises ValidationError when required fields are missing."""
    with pytest.raises(ValidationError):
        PatientBase()

    with pytest.raises(ValidationError):
        PatientBase(first_name="John", last_name="Doe")

    with pytest.raises(ValidationError):
        PatientBase(date_of_birth=datetime.date(1990, 1, 1))


def test_patient_base_max_length_validation() -> None:
    """Verify PatientBase rejects first_name or last_name exceeding 100 chars."""
    data = _valid_patient_data()
    data["first_name"] = "A" * 101
    with pytest.raises(ValidationError):
        PatientBase(**data)

    data = _valid_patient_data()
    data["last_name"] = "B" * 101
    with pytest.raises(ValidationError):
        PatientBase(**data)


def test_patient_base_email_validation() -> None:
    """Verify PatientBase rejects invalid email formats and accepts valid or None."""
    data = _valid_patient_data()
    data["email"] = "not-an-email"
    with pytest.raises(ValidationError):
        PatientBase(**data)

    data = _valid_patient_data()
    data["email"] = None
    patient = PatientBase(**data)
    assert patient.email is None


def test_patient_update_all_fields_optional() -> None:
    """Verify PatientUpdate can be instantiated with no, some, or all fields."""
    empty = PatientUpdate()
    assert empty.first_name is None
    assert empty.last_name is None
    assert empty.date_of_birth is None

    partial = PatientUpdate(first_name="Updated")
    assert partial.first_name == "Updated"
    assert partial.last_name is None

    full = PatientUpdate(**_valid_patient_data())
    assert full.first_name == "John"
    assert full.last_name == "Doe"


def test_patient_response_from_attributes() -> None:
    """Verify PatientResponse can be created from an ORM-like object."""
    now = datetime.datetime(2026, 1, 1, 12, 0, 0)
    obj = SimpleNamespace(
        id=1,
        first_name="John",
        last_name="Doe",
        email="john@example.com",
        phone="555-0100",
        date_of_birth=datetime.date(1990, 1, 1),
        medical_history="None",
        created_at=now,
        updated_at=now,
    )
    response = PatientResponse.from_orm(obj)
    assert response.id == 1
    assert response.first_name == "John"
    assert response.created_at == now


def test_patient_list_response_structure() -> None:
    """Verify PatientListResponse contains patients list, total, page, per_page."""
    now = datetime.datetime(2026, 1, 1, 12, 0, 0)
    patient_data = {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": None,
        "date_of_birth": datetime.date(1990, 1, 1),
        "medical_history": "",
        "created_at": now,
        "updated_at": now,
    }
    resp = PatientListResponse(
        patients=[patient_data],
        total=1,
        page=1,
        per_page=10,
    )
    assert len(resp.patients) == 1
    assert resp.total == 1
    assert resp.page == 1
    assert resp.per_page == 10
