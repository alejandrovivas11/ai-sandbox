from datetime import date, datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
    LoginRequest,
    PatientCreate,
    PatientResponse,
    PatientUpdate,
    Token,
)


def test_patient_create_valid() -> None:
    """Verify PatientCreate accepts valid data with all required fields
    and optional fields default to None."""
    patient = PatientCreate(
        email="test@example.com",
        password="securepass123",
        first_name="John",
        last_name="Doe",
    )
    assert patient.email == "test@example.com"
    assert patient.password == "securepass123"
    assert patient.first_name == "John"
    assert patient.last_name == "Doe"
    assert patient.date_of_birth is None
    assert patient.phone_number is None
    assert patient.address is None


def test_patient_create_invalid_email() -> None:
    """Verify PatientCreate rejects invalid email format."""
    with pytest.raises(ValidationError):
        PatientCreate(
            email="not-an-email",
            password="securepass123",
            first_name="John",
            last_name="Doe",
        )


def test_patient_create_password_min_length() -> None:
    """Verify PatientCreate rejects passwords shorter than 8 characters."""
    with pytest.raises(ValidationError) as exc_info:
        PatientCreate(
            email="test@example.com",
            password="short",
            first_name="John",
            last_name="Doe",
        )
    assert "password" in str(exc_info.value).lower()


def test_patient_update_all_optional() -> None:
    """Verify PatientUpdate can be instantiated with no fields (all optional)."""
    update = PatientUpdate()
    assert update.first_name is None
    assert update.last_name is None
    assert update.date_of_birth is None
    assert update.phone_number is None
    assert update.address is None


def test_patient_response_from_attributes() -> None:
    """Verify PatientResponse has from_attributes=True in model_config
    and can be created from an ORM-like object."""
    assert PatientResponse.model_config.get("from_attributes") is True

    class FakeORM:
        id = 1
        email = "test@example.com"
        first_name = "John"
        last_name = "Doe"
        date_of_birth = date(1990, 1, 15)
        phone_number = "555-0100"
        address = "123 Main St"
        created_at = datetime(2026, 1, 1, tzinfo=timezone.utc)

    response = PatientResponse.model_validate(FakeORM())
    assert response.id == 1
    assert response.email == "test@example.com"
    assert response.first_name == "John"


def test_patient_create_with_optional_fields() -> None:
    """Verify PatientCreate accepts valid data when all optional fields
    are explicitly provided."""
    patient = PatientCreate(
        email="jane@example.com",
        password="securepass123",
        first_name="Jane",
        last_name="Smith",
        date_of_birth=date(1985, 3, 20),
        phone_number="555-0199",
        address="456 Oak Ave",
    )
    assert patient.email == "jane@example.com"
    assert patient.first_name == "Jane"
    assert patient.last_name == "Smith"
    assert patient.date_of_birth == date(1985, 3, 20)
    assert patient.phone_number == "555-0199"
    assert patient.address == "456 Oak Ave"


def test_appointment_create_valid() -> None:
    """Verify AppointmentCreate accepts valid data with required fields
    and optional fields default to None."""
    appt = AppointmentCreate(
        appointment_date=datetime(2026, 6, 15, 10, 0, tzinfo=timezone.utc),
        reason="Annual checkup",
    )
    assert appt.reason == "Annual checkup"
    assert appt.doctor_name is None
    assert appt.notes is None


def test_appointment_create_with_doctor_name() -> None:
    """Verify AppointmentCreate accepts an optional doctor_name."""
    appt = AppointmentCreate(
        appointment_date=datetime(2026, 6, 15, 10, 0, tzinfo=timezone.utc),
        reason="Annual checkup",
        doctor_name="Dr. Smith",
    )
    assert appt.doctor_name == "Dr. Smith"


def test_appointment_update_all_optional() -> None:
    """Verify AppointmentUpdate can be instantiated with no fields."""
    update = AppointmentUpdate()
    assert update.appointment_date is None
    assert update.reason is None
    assert update.status is None
    assert update.doctor_name is None
    assert update.notes is None


def test_appointment_update_status_and_doctor_name() -> None:
    """Verify AppointmentUpdate accepts status and doctor_name fields."""
    update = AppointmentUpdate(status="confirmed", doctor_name="Dr. Jones")
    assert update.status == "confirmed"
    assert update.doctor_name == "Dr. Jones"


def test_appointment_response_from_attributes() -> None:
    """Verify AppointmentResponse has from_attributes=True in model_config
    and includes all specified fields."""
    assert AppointmentResponse.model_config.get("from_attributes") is True

    class FakeORM:
        id = 10
        patient_id = 5
        appointment_date = datetime(2026, 6, 15, 10, 0, tzinfo=timezone.utc)
        reason = "Follow-up"
        status = "scheduled"
        doctor_name = "Dr. Adams"
        notes = "Bring lab results"
        created_at = datetime(2026, 1, 1, tzinfo=timezone.utc)

    response = AppointmentResponse.model_validate(FakeORM())
    assert response.id == 10
    assert response.patient_id == 5
    assert response.reason == "Follow-up"
    assert response.status == "scheduled"
    assert response.doctor_name == "Dr. Adams"
    assert response.notes == "Bring lab results"


def test_appointment_response_doctor_name_optional() -> None:
    """Verify AppointmentResponse allows doctor_name to be None."""

    class FakeORM:
        id = 11
        patient_id = 6
        appointment_date = datetime(2026, 7, 1, 9, 0, tzinfo=timezone.utc)
        reason = "Consultation"
        status = "pending"
        doctor_name = None
        notes = None
        created_at = datetime(2026, 1, 2, tzinfo=timezone.utc)

    response = AppointmentResponse.model_validate(FakeORM())
    assert response.doctor_name is None
    assert response.notes is None


def test_token_schema() -> None:
    """Verify Token schema has access_token and token_type fields."""
    token = Token(access_token="abc123", token_type="bearer")
    assert token.access_token == "abc123"
    assert token.token_type == "bearer"


def test_login_request_schema() -> None:
    """Verify LoginRequest schema has email and password fields."""
    login = LoginRequest(email="user@example.com", password="mypassword")
    assert login.email == "user@example.com"
    assert login.password == "mypassword"


def test_login_request_accepts_plain_string_email() -> None:
    """Verify LoginRequest uses plain str for email, unlike PatientCreate
    which uses EmailStr. Any string should be accepted."""
    login = LoginRequest(email="not-an-email", password="mypassword")
    assert login.email == "not-an-email"


def test_login_request_invalid_email_format_accepted() -> None:
    """Verify LoginRequest does not reject invalid email formats since
    it uses str instead of EmailStr."""
    login = LoginRequest(email="@@@", password="testpass")
    assert login.email == "@@@"
