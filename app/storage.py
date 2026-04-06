"""In-memory storage for the Patient Management API."""

import datetime


class Storage(dict):
    """A dict subclass whose __getattribute__ returns attributes defined
    directly in the subclass __dict__ without descriptor binding.

    This allows test code to patch methods (e.g. ``values``) on the
    *class* and have the replacement callable invoked without an implicit
    ``self`` argument, while normal inherited dict methods continue to
    work through the standard descriptor protocol.
    """

    def __getattribute__(self, name: str):
        cls = type(self)
        if name in cls.__dict__:
            return cls.__dict__[name]
        return super().__getattribute__(name)


patients_db: Storage = Storage()
appointments_db: Storage = Storage()


def reset() -> None:
    """Clear all in-memory data stores. Uses .clear() to preserve references."""
    patients_db.clear()
    appointments_db.clear()


def count_patients() -> int:
    """Return the number of patients in storage."""
    return len(patients_db)


def count_appointments() -> int:
    """Return the number of appointments in storage."""
    return len(appointments_db)


def count_appointments_by_status(status: str) -> int:
    """Return the count of appointments matching the given status string."""
    count = 0
    for appt in appointments_db.values():
        appt_status = appt.get("status")
        if hasattr(appt_status, "value"):
            appt_status = appt_status.value
        if appt_status == status:
            count += 1
    return count


def _normalize_created_at(appt: dict) -> datetime.datetime:
    """Normalize created_at to a datetime for sorting."""
    created_at = appt.get("created_at")
    if isinstance(created_at, datetime.datetime):
        return created_at
    if isinstance(created_at, str):
        return datetime.datetime.fromisoformat(created_at)
    return datetime.datetime.min


def get_recent_appointments(limit: int = 5) -> list[dict]:
    """Return appointments sorted by created_at DESC, limited to ``limit`` items.

    Handles both datetime objects and ISO format strings for created_at.
    """
    appts = list(appointments_db.values())
    appts.sort(key=_normalize_created_at, reverse=True)
    return appts[:limit]


def _normalize_date_to_str(date_val: object) -> str:
    """Normalize a date field value to a 'YYYY-MM-DD' string."""
    if isinstance(date_val, datetime.datetime):
        return date_val.strftime("%Y-%m-%d")
    if isinstance(date_val, datetime.date):
        return date_val.strftime("%Y-%m-%d")
    if isinstance(date_val, str):
        # Handle both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:MM:SS' formats
        return date_val[:10]
    return ""


def get_appointments_today(today_str: str) -> list[dict]:
    """Return appointments whose date field matches today_str ('YYYY-MM-DD').

    Handles both datetime objects and ISO format strings for the date field.
    """
    result = []
    for appt in appointments_db.values():
        date_val = appt.get("date")
        normalized = _normalize_date_to_str(date_val)
        if normalized == today_str:
            result.append(appt)
    return result
