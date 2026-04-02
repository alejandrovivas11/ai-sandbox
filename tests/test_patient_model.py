from datetime import date, datetime

import bcrypt
import pytest
from sqlalchemy import (
    Column, ForeignKey, Integer, String, Date, DateTime, Boolean, inspect,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import relationship

from app.database import Base


def _hash(plain: str) -> str:
    """Hash a plaintext password with bcrypt and return the UTF-8 string."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# Pre-computed bcrypt hashes -- each comment notes the plaintext that was
# hashed.  Tests should always store values like these, never raw passwords.
HASHED_PASSWORD_ABC123 = _hash("abc123")
HASHED_PASSWORD_1 = _hash("password_one")
HASHED_PASSWORD_2 = _hash("password_two")
HASHED_PASSWORD_X = _hash("password_x")


# Stub Appointment model so the Patient.appointments relationship can resolve.
# This will be replaced by the real Appointment model when it is implemented.
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient = relationship("Patient", back_populates="appointments")


# ---------------------------------------------------------------------------
# Existing structural / CRUD tests
# ---------------------------------------------------------------------------

def test_patient_model_importable_from_app_models():
    """Verify that 'from app.models import Patient' works and has correct tablename."""
    from app.models import Patient

    assert Patient.__tablename__ == "patients"


def test_patients_table_created_on_startup(db_session):
    """Confirm the 'patients' table exists after metadata.create_all."""
    inspector = inspect(db_session.bind)
    table_names = inspector.get_table_names()
    assert "patients" in table_names


def test_patient_model_has_all_columns():
    """Inspect Patient.__table__.columns and verify all 11 columns with correct types."""
    from app.models import Patient

    columns = {c.name: c for c in Patient.__table__.columns}

    expected = {
        "id": Integer,
        "email": String,
        "hashed_password": String,
        "first_name": String,
        "last_name": String,
        "date_of_birth": Date,
        "phone_number": String,
        "address": String,
        "created_at": DateTime,
        "updated_at": DateTime,
        "is_active": Boolean,
    }

    assert set(columns.keys()) == set(expected.keys()), (
        f"Column mismatch: {set(columns.keys()) ^ set(expected.keys())}"
    )

    for name, expected_type in expected.items():
        col = columns[name]
        assert isinstance(col.type, expected_type), (
            f"Column '{name}' expected {expected_type}, got {type(col.type)}"
        )


def test_email_unique_and_indexed():
    """Check that the email column has unique=True and index=True."""
    from app.models import Patient

    email_col = Patient.__table__.columns["email"]
    assert email_col.unique is True
    assert email_col.index is True


def test_create_patient_record(db_session):
    """Insert a Patient and verify all fields including defaults."""
    from app.models import Patient

    patient = Patient(
        email="test@example.com",
        hashed_password=HASHED_PASSWORD_ABC123,
        first_name="Jane",
        last_name="Doe",
        date_of_birth=date(1990, 5, 15),
        phone_number="555-0100",
        address="123 Main St",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    assert patient.id is not None
    assert patient.email == "test@example.com"
    assert patient.hashed_password == HASHED_PASSWORD_ABC123
    assert patient.first_name == "Jane"
    assert patient.last_name == "Doe"
    assert patient.date_of_birth == date(1990, 5, 15)
    assert patient.phone_number == "555-0100"
    assert patient.address == "123 Main St"
    assert isinstance(patient.created_at, datetime)
    assert isinstance(patient.updated_at, datetime)
    assert patient.is_active is True


def test_email_unique_constraint_enforced(db_session):
    """Insert two Patients with the same email and verify IntegrityError."""
    from app.models import Patient

    patient1 = Patient(
        email="duplicate@example.com",
        hashed_password=HASHED_PASSWORD_1,
        first_name="Alice",
        last_name="Smith",
    )
    db_session.add(patient1)
    db_session.commit()

    patient2 = Patient(
        email="duplicate@example.com",
        hashed_password=HASHED_PASSWORD_2,
        first_name="Bob",
        last_name="Jones",
    )
    db_session.add(patient2)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_not_nullable_fields_enforced(db_session):
    """Attempt to insert a Patient with null required fields and verify IntegrityError."""
    from app.models import Patient

    # Missing email
    p = Patient(
        email=None,
        hashed_password=HASHED_PASSWORD_X,
        first_name="Test",
        last_name="User",
    )
    db_session.add(p)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Missing hashed_password (None passes the validator; the DB rejects it)
    p = Patient(
        email="a@example.com",
        hashed_password=None,
        first_name="Test",
        last_name="User",
    )
    db_session.add(p)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Missing first_name
    p = Patient(
        email="b@example.com",
        hashed_password=HASHED_PASSWORD_X,
        first_name=None,
        last_name="User",
    )
    db_session.add(p)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Missing last_name
    p = Patient(
        email="c@example.com",
        hashed_password=HASHED_PASSWORD_X,
        first_name="Test",
        last_name=None,
    )
    db_session.add(p)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


# ---------------------------------------------------------------------------
# Password hashing tests
# ---------------------------------------------------------------------------

def test_hash_password_produces_bcrypt_hash():
    """Patient.hash_password() must return a string starting with a bcrypt prefix."""
    from app.models import Patient

    hashed = Patient.hash_password("my_secret")
    assert hashed.startswith(("$2b$", "$2a$", "$2y$"))


def test_set_password_and_verify_password(db_session):
    """set_password() stores a hash that verify_password() can validate."""
    from app.models import Patient

    patient = Patient(
        email="hash@example.com",
        hashed_password=Patient.hash_password("temporary"),
        first_name="Hash",
        last_name="Test",
    )
    patient.set_password("correct_horse_battery_staple")
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    assert patient.verify_password("correct_horse_battery_staple") is True
    assert patient.verify_password("wrong_password") is False


def test_plaintext_password_rejected_by_validator():
    """Assigning a plaintext string to hashed_password must raise ValueError."""
    from app.models import Patient

    with pytest.raises(ValueError, match="hashed_password must be a bcrypt hash"):
        Patient(
            email="plain@example.com",
            hashed_password="not_a_hash",
            first_name="Bad",
            last_name="Practice",
        )


# ---------------------------------------------------------------------------
# PII masking tests
# ---------------------------------------------------------------------------

def _make_patient():
    """Create an in-memory Patient with representative PII for masking tests."""
    from app.models import Patient

    return Patient(
        email="jane.doe@example.com",
        hashed_password=Patient.hash_password("test1234"),
        first_name="Jane",
        last_name="Doe",
        date_of_birth=date(1990, 5, 15),
        phone_number="555-0100",
        address="123 Main St",
    )


def test_masked_email():
    patient = _make_patient()
    masked = patient.masked_email()
    # Local part "jane.doe" -> "j******e", domain unchanged.
    assert masked.endswith("@example.com")
    assert masked[0] == "j"
    assert "*" in masked
    # The raw email must not appear.
    assert masked != patient.email


def test_masked_phone():
    patient = _make_patient()
    masked = patient.masked_phone()
    # Last four digits (0, 1, 0, 0) remain; leading digits are replaced.
    assert masked.endswith("0100")
    assert "*" in masked


def test_masked_address():
    patient = _make_patient()
    masked = patient.masked_address()
    # Only the last 6 characters of "123 Main St" should be visible.
    assert masked.endswith("ain St")
    assert masked.startswith("*")


def test_masked_date_of_birth():
    patient = _make_patient()
    masked = patient.masked_date_of_birth()
    assert masked == "1990-**-**"


def test_to_public_dict_masks_pii():
    patient = _make_patient()
    public = patient.to_public_dict()
    # PII fields must be masked.
    assert public["email"] != "jane.doe@example.com"
    assert "*" in public["email"]
    assert "*" in public["phone_number"]
    assert "*" in public["address"]
    assert public["date_of_birth"] == "1990-**-**"
    # Non-PII fields are present.
    assert public["first_name"] == "Jane"
    assert public["last_name"] == "Doe"


def test_to_full_dict_viewer_masks_pii():
    patient = _make_patient()
    result = patient.to_full_dict(role="viewer")
    assert "*" in result["email"]


def test_to_full_dict_admin_reveals_pii():
    patient = _make_patient()
    result = patient.to_full_dict(role="admin")
    assert result["email"] == "jane.doe@example.com"
    assert result["phone_number"] == "555-0100"
    assert result["address"] == "123 Main St"
    assert result["date_of_birth"] == "1990-05-15"


def test_to_full_dict_provider_reveals_pii():
    patient = _make_patient()
    result = patient.to_full_dict(role="provider")
    assert result["email"] == "jane.doe@example.com"
