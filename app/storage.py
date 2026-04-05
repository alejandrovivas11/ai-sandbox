"""In-memory storage for the Patient Management API."""

patients_db: dict[str, dict] = {}
appointments_db: dict[str, dict] = {}


def reset() -> None:
    """Clear all in-memory data stores. Uses .clear() to preserve references."""
    patients_db.clear()
    appointments_db.clear()
