"""Tests for the Appointment SQLAlchemy model and AppointmentStatus enum."""

from datetime import datetime, timezone

from sqlalchemy import inspect

from app.models import (
    Appointment,
    AppointmentStatus,
    Patient,
    StatusResponse,
)


# ---- helpers ---------------------------------------------------------------

def _column_map() -> dict:
    """Return a dict of column_name -> Column object for Appointment."""
    mapper = inspect(Appointment)
    return {col.key: col for col in mapper.columns}


# ---- tests -----------------------------------------------------------------

def test_appointment_table_name() -> None:
    """Verify that Appointment.__tablename__ equals 'appointments'."""
    assert Appointment.__tablename__ == "appointments"


def test_appointment_has_all_columns() -> None:
    """Verify the Appointment model has all 9 required columns."""
    expected = {
        "id",
        "patient_id",
        "appointment_date",
        "reason",
        "status",
        "doctor_name",
        "notes",
        "created_at",
        "updated_at",
    }
    mapper = inspect(Appointment)
    actual = {col.key for col in mapper.columns}
    assert expected == actual


def test_patient_id_foreign_key() -> None:
    """Verify that patient_id has a ForeignKey referencing 'patients.id'."""
    table = Appointment.__table__
    col = table.c.patient_id
    fk_targets = {fk.target_fullname for fk in col.foreign_keys}
    assert "patients.id" in fk_targets


def test_appointment_status_enum_values() -> None:
    """Verify AppointmentStatus has exactly SCHEDULED, COMPLETED, CANCELLED."""
    assert AppointmentStatus.SCHEDULED.value == "scheduled"
    assert AppointmentStatus.COMPLETED.value == "completed"
    assert AppointmentStatus.CANCELLED.value == "cancelled"
    assert len(AppointmentStatus) == 3


def test_appointment_patient_relationship() -> None:
    """Verify bidirectional relationship between Appointment and Patient."""
    appt_rels = inspect(Appointment).relationships
    patient_rels = inspect(Patient).relationships

    # Appointment has a 'patient' relationship
    assert "patient" in {r.key for r in appt_rels}

    # Patient has an 'appointments' relationship
    assert "appointments" in {r.key for r in patient_rels}

    # Verify back_populates wiring
    appt_rel = appt_rels["patient"]
    assert appt_rel.back_populates == "appointments"

    patient_rel = patient_rels["appointments"]
    assert patient_rel.back_populates == "patient"


def test_appointment_column_nullable_constraints() -> None:
    """Verify nullable constraints on Appointment columns."""
    table = Appointment.__table__

    not_nullable = ["patient_id", "appointment_date", "reason", "status"]
    for col_name in not_nullable:
        assert table.c[col_name].nullable is False, (
            f"{col_name} should not be nullable"
        )

    nullable = ["doctor_name", "notes"]
    for col_name in nullable:
        assert table.c[col_name].nullable is True, (
            f"{col_name} should be nullable"
        )


def test_status_response_model_still_exists() -> None:
    """Verify StatusResponse Pydantic model is still importable and works."""
    response = StatusResponse(
        app_name="test",
        version="0.0.1",
        status="ok",
        timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
    assert response.app_name == "test"
    assert response.version == "0.0.1"
    assert response.status == "ok"
