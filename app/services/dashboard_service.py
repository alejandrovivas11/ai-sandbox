"""Service layer for computing dashboard metrics."""

from datetime import datetime

from app.storage import get_storage


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
        # Normalize date_time: handle both datetime objects and ISO strings
        dt = appt.get("date_time")
        if isinstance(dt, str):
            dt = datetime.fromisoformat(dt)

        # Normalize status: handle both enum (with .value) and plain string
        status = appt.get("status")
        if hasattr(status, "value"):
            status = status.value

        # Count upcoming (strictly in the future)
        if dt is not None and dt > now:
            upcoming_count += 1

        # Count completed
        if status == "completed":
            completed_count += 1
            # Check if appointment date is today for patients_seen_today
            if dt is not None and dt.date() == today:
                patient_id = appt.get("patient_id")
                if patient_id is not None:
                    seen_today_patient_ids.add(patient_id)

        # Count cancelled
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
