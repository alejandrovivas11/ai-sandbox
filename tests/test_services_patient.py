"""Unit tests for the Patient service layer with the updated 'name' field.

These tests verify that service functions correctly handle the single 'name'
field in create and update operations.
"""

from app.services import patient_service


def _build_patient_create_model():
    """Build a PatientCreate instance using the new 'name' field schema.

    Imports PatientCreate from app.models.patient -- this will fail until the
    model is updated to accept a 'name' field.
    """
    from app.models.patient import PatientCreate

    return PatientCreate(
        name="Jane Doe",
        email="jane.doe@example.com",
        phone="555-123-4567",
        date_of_birth="1990-01-15",
    )


def _build_patient_update_model(**overrides: object):
    """Build a PatientUpdate instance using the new 'name' field schema."""
    from app.models.patient import PatientUpdate

    defaults = {"name": "John Smith"}
    defaults.update(overrides)
    return PatientUpdate(**defaults)


class TestPatientServiceCreate:
    """Tests for patient_service.create_patient with 'name' field."""

    def test_patient_service_create_handles_name_field(self) -> None:
        """AC3: Verify that patient service create method correctly processes
        and stores 'name' field."""
        data = _build_patient_create_model()

        result = patient_service.create_patient(data)

        assert result is not None, "create_patient should return a dict"
        assert result["name"] == "Jane Doe", (
            "Created patient dict should contain the 'name' field"
        )
        assert "first_name" not in result, (
            "Created patient dict must not contain legacy 'first_name' field"
        )
        assert "last_name" not in result, (
            "Created patient dict must not contain legacy 'last_name' field"
        )


class TestPatientServiceUpdate:
    """Tests for patient_service.update_patient with 'name' field."""

    def test_patient_service_update_handles_name_field(self) -> None:
        """AC3: Verify that patient service update method correctly handles
        'name' field in update operations."""
        create_data = _build_patient_create_model()
        created = patient_service.create_patient(create_data)
        patient_id = created["id"]

        update_data = _build_patient_update_model(name="Updated Name")
        result = patient_service.update_patient(patient_id, update_data)

        assert result is not None, (
            "update_patient should return the updated dict"
        )
        assert result["name"] == "Updated Name", (
            "Updated patient dict should reflect the new 'name' value"
        )
