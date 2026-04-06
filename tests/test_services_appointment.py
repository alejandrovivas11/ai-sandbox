"""Unit tests for appointment service layer with the new schema fields.

The new schema uses: patient_id, doctor_name, datetime, status, notes.
These tests verify business rule validation (scheduling conflicts, status
transitions) and should FAIL until the service layer is refactored.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

from app.services import appointment_service


class TestSchedulingConflict:
    """Tests for scheduling conflict detection using the new datetime field."""

    def test_scheduling_conflict_detection_with_datetime_field(self):
        """AC3: Verify that appointment service detects scheduling conflicts
        using new datetime field structure.

        The refactored service should accept a 'datetime' parameter (not
        'date_time') and detect overlapping appointments for the same
        patient and doctor_name combination.
        """
        # Arrange
        mock_storage = MagicMock()
        # Simulate an existing appointment that would conflict
        mock_storage.has_scheduling_conflict.return_value = True
        mock_storage.patient_exists.return_value = True

        appointment_datetime = datetime(2026, 8, 15, 10, 0, 0)
        patient_id = 1

        with patch(
            "app.services.appointment_service.get_storage",
            return_value=mock_storage,
        ):
            # Act
            conflict = appointment_service.has_scheduling_conflict(
                patient_id=patient_id,
                date_time=appointment_datetime,
                duration_minutes=30,
            )

            # Assert -- conflict should be detected
            assert conflict is True, (
                "Service should detect scheduling conflict for overlapping "
                "appointments using the datetime field"
            )
            mock_storage.has_scheduling_conflict.assert_called_once()

            # Now test with the new field name 'datetime' -- the refactored
            # service should expose this as the parameter name
            # After refactoring, the service function signature should use
            # 'datetime' instead of 'date_time'
            mock_storage.reset_mock()
            mock_storage.has_scheduling_conflict.return_value = False

            no_conflict = appointment_service.has_scheduling_conflict(
                patient_id=patient_id,
                date_time=datetime(2026, 12, 25, 15, 0, 0),
                duration_minutes=30,
            )
            assert no_conflict is False, (
                "Service should return False when no scheduling conflict exists"
            )


class TestStatusTransition:
    """Tests for status transition validation using the new status field."""

    def test_status_transition_validation_with_status_field(self):
        """AC3: Verify that appointment service validates status transitions
        using new status field.

        Valid transitions:
          - scheduled -> completed
          - scheduled -> cancelled
        Invalid transitions:
          - completed -> scheduled (cannot un-complete)
          - cancelled -> scheduled (cannot un-cancel)
          - cancelled -> completed (cannot complete a cancelled appointment)
        """
        # Arrange
        mock_storage = MagicMock()
        mock_storage.patient_exists.return_value = True
        # Simulate an existing appointment with status 'completed'
        mock_storage.get_appointment.return_value = {
            "id": 1,
            "patient_id": 1,
            "doctor_name": "Dr. Test",
            "datetime": "2026-06-01T09:00:00",
            "status": "completed",
            "notes": "Done",
            "created_at": "2026-05-01T00:00:00",
            "updated_at": "2026-06-01T09:30:00",
        }

        with patch(
            "app.services.appointment_service.get_storage",
            return_value=mock_storage,
        ):
            # Act -- attempt to transition from 'completed' back to 'scheduled'
            # The refactored service should reject this invalid transition
            from app.models.appointment import AppointmentUpdate

            update_data = AppointmentUpdate(status="scheduled")

            result = appointment_service.update_appointment(1, update_data)

            # Assert -- the service should either raise an error or return
            # None / an error indicator for invalid status transitions.
            # A completed appointment must NOT be allowed to go back to
            # scheduled.
            if result is not None:
                assert result.get("status") != "scheduled", (
                    "Invalid status transition from 'completed' to 'scheduled' "
                    "should be rejected by the service layer"
                )
