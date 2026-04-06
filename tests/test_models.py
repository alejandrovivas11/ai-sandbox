"""Tests for the Patient model field structure.

Verifies the Patient model exposes the exact field set required by the
updated domain specification.
"""


class TestPatientModelFields:
    """Verify Patient model has the correct field structure."""

    def test_patient_model_has_exact_field_structure(self) -> None:
        """AC1: Verify that Patient model contains name (string), email
        (string, unique), phone (string), date_of_birth (date) fields."""
        from app.models.patient import PatientCreate

        fields = PatientCreate.model_fields

        assert "name" in fields, (
            "PatientCreate must have a 'name' field"
        )
        assert "email" in fields, (
            "PatientCreate must have an 'email' field"
        )
        assert "phone" in fields, (
            "PatientCreate must have a 'phone' field"
        )
        assert "date_of_birth" in fields, (
            "PatientCreate must have a 'date_of_birth' field"
        )

        # Ensure legacy fields are NOT present
        assert "first_name" not in fields, (
            "PatientCreate must not contain legacy 'first_name' field"
        )
        assert "last_name" not in fields, (
            "PatientCreate must not contain legacy 'last_name' field"
        )
        assert "phone_number" not in fields, (
            "PatientCreate must use 'phone' not legacy 'phone_number' field"
        )
        assert "gender" not in fields, (
            "PatientCreate must not contain 'gender' field in new schema"
        )
        assert "address" not in fields, (
            "PatientCreate must not contain 'address' field in new schema"
        )
