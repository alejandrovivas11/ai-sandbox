"""Service layer for computing dashboard metrics."""

from datetime import datetime

from app import storage


def get_dashboard_metrics() -> dict:
    """Compute aggregated dashboard metrics from in-memory data stores.

    Iterates over appointments_db.values() exactly once to compute all
    appointment-based metrics. Handles date_time being either a datetime
    object or an ISO-format string, and status being either an enum or a
    plain string.

    Returns a dict with six integer keys.
    """
    total_patients: int = len(storage.patients_db)
    total_appointments: int = len(storage.appointments_db)

    now: datetime = datetime.utcnow()
    today = now.date()

    upcoming_count: int = 0
    completed_count: int = 0
    cancelled_count: int = 0
    seen_today_patient_ids: set[str] = set()

    for appt in storage.appointments_db.values():
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
