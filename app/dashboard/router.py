"""
Dashboard metrics route.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.appointments.schemas import AppointmentResponse
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.dashboard.schemas import DashboardMetrics
from app.dashboard.service import get_dashboard_metrics
from app.db.dependencies import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _appointment_to_response(appointment) -> AppointmentResponse:
    """Convert an Appointment ORM object to an AppointmentResponse."""
    patient_name = None
    if appointment.patient is not None:
        patient_name = (
            f"{appointment.patient.first_name} {appointment.patient.last_name}"
        )
    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        duration_minutes=appointment.duration_minutes,
        status=appointment.status,
        reason=appointment.reason,
        notes=appointment.notes,
        patient_name=patient_name,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at,
    )


@router.get("/metrics", response_model=DashboardMetrics)
def get_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardMetrics:
    """Return aggregated dashboard metrics."""
    metrics = get_dashboard_metrics(db)
    return DashboardMetrics(
        total_patients=metrics["total_patients"],
        todays_appointments=metrics["todays_appointments"],
        upcoming_week_appointments=metrics["upcoming_week_appointments"],
        recent_patients=metrics["recent_patients"],
        upcoming_appointments=[
            _appointment_to_response(a)
            for a in metrics["upcoming_appointments"]
        ],
    )
