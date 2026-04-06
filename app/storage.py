"""In-memory storage for the Patient Management API."""


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

_patient_id_counter: int = 0


def next_patient_id() -> int:
    """Return the next sequential integer patient id."""
    global _patient_id_counter
    _patient_id_counter += 1
    return _patient_id_counter


def reset() -> None:
    """Clear all in-memory data stores. Uses .clear() to preserve references."""
    global _patient_id_counter
    patients_db.clear()
    appointments_db.clear()
    _patient_id_counter = 0
