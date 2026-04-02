import os
from pathlib import Path
from urllib.parse import urlparse

from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

_BASE_DIR = Path(__file__).resolve().parent.parent
_DEFAULT_DB_URL = f"sqlite:///{_BASE_DIR / 'sandbox.db'}"

_ALLOWED_SCHEMES = frozenset({"sqlite", "postgresql", "mysql"})


def _validate_database_url(url: str) -> str:
    """Validate a database URL against an allowlist of known schemes.

    Raises ``ValueError`` if the URL scheme is not in the allowlist, preventing
    arbitrary or malicious connection strings from being used.
    """
    parsed = urlparse(url)
    # SQLAlchemy dialects use '+' for driver, e.g. postgresql+psycopg2
    base_scheme = parsed.scheme.split("+")[0].lower()
    if base_scheme not in _ALLOWED_SCHEMES:
        raise ValueError(
            f"Unsupported database scheme: {parsed.scheme!r}. "
            f"Allowed base schemes: {', '.join(sorted(_ALLOWED_SCHEMES))}"
        )
    return url


DATABASE_URL = _validate_database_url(os.getenv("DATABASE_URL", _DEFAULT_DB_URL))

_connect_args: dict = {}
if DATABASE_URL.startswith("sqlite"):
    _connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=_connect_args)


# Enable foreign-key constraint enforcement for SQLite (off by default).
if DATABASE_URL.startswith("sqlite"):

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record) -> None:  # type: ignore[no-untyped-def]
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
