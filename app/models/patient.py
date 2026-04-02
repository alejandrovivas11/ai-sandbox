from datetime import datetime

import bcrypt
from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String
from sqlalchemy.orm import relationship, validates

from app.database import Base

# Recognised bcrypt hash prefixes used by the validator.
_BCRYPT_PREFIXES = ("$2b$", "$2a$", "$2y$")


class Patient(Base):
    """Patient model storing personal health information.

    Security notes
    --------------
    Password storage:
        The ``hashed_password`` column must only receive bcrypt-hashed
        values.  Use :meth:`hash_password` (static) to produce a hash
        from a plaintext password, or :meth:`set_password` to hash and
        assign in one step.  :meth:`verify_password` compares a
        plaintext candidate against the stored hash.  A SQLAlchemy
        ``@validates`` hook rejects any value that does not carry a
        recognised bcrypt prefix, preventing accidental storage of
        plaintext passwords.

    PII protection:
        Fields ``email``, ``phone_number``, ``address``, and
        ``date_of_birth`` contain personally identifiable information.
        The helper methods :meth:`masked_email`, :meth:`masked_phone`,
        :meth:`masked_address`, and :meth:`masked_date_of_birth` return
        redacted representations suitable for unprivileged contexts.
        :meth:`to_public_dict` returns a full dictionary with every PII
        field masked, while :meth:`to_full_dict` gates unmasked access
        behind a *role* parameter (only ``admin`` and ``provider`` are
        authorised to see raw PII).
    """

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    appointments = relationship("Appointment", back_populates="patient")

    # -- Password management ------------------------------------------------

    @staticmethod
    def hash_password(plain_password: str) -> str:
        """Return a bcrypt hash of *plain_password*."""
        return bcrypt.hashpw(
            plain_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def set_password(self, plain_password: str) -> None:
        """Hash *plain_password* with bcrypt and store the result."""
        self.hashed_password = bcrypt.hashpw(
            plain_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def verify_password(self, plain_password: str) -> bool:
        """Return ``True`` if *plain_password* matches the stored hash."""
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            self.hashed_password.encode("utf-8"),
        )

    @validates("hashed_password")
    def _validate_hashed_password(self, _key: str, value: str) -> str:
        """Reject values that are not valid bcrypt hashes.

        ``None`` is allowed through so that the database-level NOT NULL
        constraint can raise the appropriate :class:`IntegrityError`.
        """
        if value is not None and not value.startswith(_BCRYPT_PREFIXES):
            raise ValueError(
                "hashed_password must be a bcrypt hash. "
                "Use Patient.hash_password() or patient.set_password() "
                "to produce one.  Plaintext passwords are not accepted."
            )
        return value

    # -- PII masking helpers ------------------------------------------------

    _PII_FIELDS = ("email", "phone_number", "address", "date_of_birth")

    def masked_email(self) -> str:
        """Return the email with the local part partially redacted.

        Example: ``jane.doe@example.com`` -> ``j******e@example.com``
        """
        if not self.email:
            return ""
        local, _, domain = self.email.partition("@")
        if len(local) <= 2:
            masked_local = local[0] + "*" * max(len(local) - 1, 0)
        else:
            masked_local = local[0] + "*" * (len(local) - 2) + local[-1]
        return f"{masked_local}@{domain}"

    def masked_phone(self) -> str:
        """Return the phone number with all but the last four digits masked.

        Example: ``555-0100`` -> ``***-0100``
        """
        if not self.phone_number:
            return ""
        digits_total = sum(c.isdigit() for c in self.phone_number)
        if digits_total <= 4:
            return self.phone_number
        # Walk backwards keeping only the last 4 digits visible.
        result: list[str] = []
        visible = 0
        for ch in reversed(self.phone_number):
            if ch.isdigit() and visible < 4:
                result.append(ch)
                visible += 1
            elif ch.isdigit():
                result.append("*")
            else:
                result.append(ch)
        return "".join(reversed(result))

    def masked_address(self) -> str:
        """Return the address with most content replaced by asterisks.

        Only the last six characters remain visible.
        """
        if not self.address:
            return ""
        if len(self.address) <= 6:
            return self.address
        return "*" * (len(self.address) - 6) + self.address[-6:]

    def masked_date_of_birth(self) -> str:
        """Return only the birth year, masking month and day.

        Example: ``1990-05-15`` -> ``1990-**-**``
        """
        if not self.date_of_birth:
            return ""
        return f"{self.date_of_birth.year}-**-**"

    def to_public_dict(self) -> dict:
        """Return a dictionary with all PII fields masked.

        Suitable for responses where the caller is not authorised to
        view full personally identifiable information.
        """
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.masked_email(),
            "phone_number": self.masked_phone(),
            "address": self.masked_address(),
            "date_of_birth": self.masked_date_of_birth(),
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    def to_full_dict(self, role: str = "viewer") -> dict:
        """Return a dictionary, revealing full PII only for authorised roles.

        Args:
            role: The role of the requester.  Only ``"admin"`` and
                ``"provider"`` may view unmasked PII.

        Returns:
            A dict of patient data.  PII fields are masked unless *role*
            is authorised.
        """
        authorised_roles = {"admin", "provider"}
        if role in authorised_roles:
            return {
                "id": self.id,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "email": self.email,
                "phone_number": self.phone_number,
                "address": self.address,
                "date_of_birth": (
                    str(self.date_of_birth) if self.date_of_birth else None
                ),
                "is_active": self.is_active,
                "created_at": self.created_at,
                "updated_at": self.updated_at,
            }
        return self.to_public_dict()
