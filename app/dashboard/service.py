"""
Dashboard service layer for metrics aggregation.
"""

import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.appointments.models import Appointment
from app.patients.models import Patient


def get_dashboard_metrics(db: Session) -> dict:
    """Aggregate dashboard metrics from the database.

    Returns a dict with total_patients, todays_appointments,
    upcoming_week_appointments, recent_patients, and upcoming_appointments.
    """
    today = datetime.date.today()
    week_from_now = today + datetime.timedelta(days=7)

    total_patients = db.query(func.count(Patient.id)).scalar() or 0

    todays_appointments = (
        db.query(func.count(Appointment.id))
        .filter(Appointment.appointment_date == today)
        .scalar()
        or 0
    )

    upcoming_week_appointments = (
        db.query(func.count(Appointment.id))
        .filter(
            Appointment.appointment_date >= today,
            Appointment.appointment_date <= week_from_now,
        )
        .scalar()
        or 0
    )

    recent_patients = (
        db.query(Patient)
        .order_by(Patient.created_at.desc())
        .limit(5)
        .all()
    )

    upcoming_appointments = (
        db.query(Appointment)
        .options(joinedload(Appointment.patient))
        .filter(
            Appointment.appointment_date >= today,
            Appointment.status == "scheduled",
        )
        .order_by(Appointment.appointment_date.asc(), Appointment.appointment_time.asc())
        .limit(5)
        .all()
    )

    return {
        "total_patients": total_patients,
        "todays_appointments": todays_appointments,
        "upcoming_week_appointments": upcoming_week_appointments,
        "recent_patients": recent_patients,
        "upcoming_appointments": upcoming_appointments,
    }
