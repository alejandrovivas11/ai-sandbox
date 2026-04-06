"""Service layer for computing dashboard metrics and analytics."""

from datetime import datetime, timedelta

from app.storage import get_storage


def calculate_growth_rate(current: int, previous: int) -> float:
    """Calculate growth rate as a percentage.

    Returns 0.0 when previous period count is zero to avoid division by zero.
    """
    if previous == 0:
        return 0.0
    return ((current - previous) / previous) * 100.0


def calculate_completion_rate(completed: int, total: int) -> float:
    """Calculate appointment completion rate as a percentage.

    Returns 0.0 when total is zero to avoid division by zero.
    """
    if total == 0:
        return 0.0
    return (completed / total) * 100.0


def format_activity_message(event_type: str, event_data: dict) -> str:
    """Format a human-readable activity message for the activity feed."""
    first_name = event_data.get("first_name", "Unknown")
    last_name = event_data.get("last_name", "")

    if event_type == "patient_registered":
        return f"Patient {first_name} {last_name} was registered"
    if event_type == "appointment_created":
        appt_type = event_data.get("appointment_type", "appointment")
        return f"Appointment ({appt_type}) created for {first_name} {last_name}"
    return f"Event: {event_type} for {first_name} {last_name}"


def get_dashboard_metrics() -> dict:
    """Compute aggregated dashboard metrics from the SQL storage layer.

    Iterates over all appointments once to compute appointment-based
    metrics.  Handles date_time being either a datetime object or an
    ISO-format string, and status being either an enum or a plain string.

    Returns a dict with six integer keys.
    """
    storage = get_storage()
    patients = storage.get_all_patients()
    appointments = storage.get_all_appointments()

    total_patients: int = len(patients)
    total_appointments: int = len(appointments)

    now: datetime = datetime.utcnow()
    today = now.date()

    upcoming_count: int = 0
    completed_count: int = 0
    cancelled_count: int = 0
    seen_today_patient_ids: set[int] = set()

    for appt in appointments:
        dt = appt.get("date_time")
        if isinstance(dt, str):
            dt = datetime.fromisoformat(dt)

        status = appt.get("status")
        if hasattr(status, "value"):
            status = status.value

        if dt is not None and dt > now:
            upcoming_count += 1

        if status == "completed":
            completed_count += 1
            if dt is not None and dt.date() == today:
                patient_id = appt.get("patient_id")
                if patient_id is not None:
                    seen_today_patient_ids.add(patient_id)

        if status == "cancelled":
            cancelled_count += 1

    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "upcoming_appointments_count": upcoming_count,
        "completed_appointments_count": completed_count,
        "cancelled_appointments_count": cancelled_count,
        "patients_seen_today": len(seen_today_patient_ids),
    }


def get_dashboard_stats() -> dict:
    """Compute comprehensive dashboard statistics overview."""
    storage = get_storage()

    patients = storage.get_all_patients()
    total_patients = len(patients)

    now = datetime.utcnow()
    first_of_month = now.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    new_patients_this_month = storage.count_patients_by_period(
        first_of_month.isoformat(), None
    )

    status_counts = storage.count_appointments_by_status()
    total_appointments = sum(status_counts.values())

    return {
        "total_patients": total_patients,
        "new_patients_this_month": new_patients_this_month,
        "total_appointments": total_appointments,
        "completed_appointments_count": status_counts.get("completed", 0),
        "cancelled_appointments_count": status_counts.get("cancelled", 0),
        "scheduled_appointments_count": status_counts.get("scheduled", 0),
    }


def get_patient_analytics(
    date_from: str | None = None,
    date_to: str | None = None,
) -> dict:
    """Compute patient analytics with growth rate calculations.

    When date_from/date_to are provided, counts patients in that range.
    Otherwise, compares current month to previous month.
    """
    storage = get_storage()
    now = datetime.utcnow()

    first_of_current_month = now.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    first_of_prev_month = (
        first_of_current_month - timedelta(days=1)
    ).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    if date_from is not None or date_to is not None:
        current_month_count = storage.count_patients_by_period(
            date_from, date_to
        )
        previous_month_count = 0
    else:
        current_month_count = storage.count_patients_by_period(
            first_of_current_month.isoformat(), None
        )
        previous_month_count = storage.count_patients_by_period(
            first_of_prev_month.isoformat(),
            first_of_current_month.isoformat(),
        )

    growth = calculate_growth_rate(current_month_count, previous_month_count)

    return {
        "growth_rate": growth,
        "current_month_count": current_month_count,
        "previous_month_count": previous_month_count,
    }


def get_appointment_analytics(
    date_from: str | None = None,
    date_to: str | None = None,
) -> dict:
    """Compute appointment analytics with status breakdown."""
    storage = get_storage()
    status_counts = storage.count_appointments_by_status(date_from, date_to)

    return {
        "status_breakdown": {
            "scheduled": status_counts.get("scheduled", 0),
            "completed": status_counts.get("completed", 0),
            "cancelled": status_counts.get("cancelled", 0),
        }
    }


def get_recent_activity() -> dict:
    """Get recent activity feed in reverse chronological order."""
    storage = get_storage()
    data = storage.get_recent_activities()

    activities: list[dict] = []
    for patient in data["patients"]:
        activities.append({
            "message": format_activity_message(
                "patient_registered", patient
            ),
            "timestamp": patient["created_at"],
        })
    for appt in data["appointments"]:
        activities.append({
            "message": format_activity_message(
                "appointment_created", appt
            ),
            "timestamp": appt["created_at"],
        })

    activities.sort(key=lambda x: x["timestamp"], reverse=True)

    return {"activities": activities}
