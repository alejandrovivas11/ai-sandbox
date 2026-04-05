"""
FastAPI dependency for database session management.
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Yield a database session, with rollback on exception and close on finish."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
