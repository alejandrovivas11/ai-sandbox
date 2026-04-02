from sqlalchemy.orm import Session

from app.database import Base, engine, get_db


def test_get_db_yields_session() -> None:
    """Verify that get_db yields a valid SQLAlchemy session and closes it."""
    gen = get_db()
    session = next(gen)
    assert isinstance(session, Session)
    try:
        gen.send(None)
    except StopIteration:
        pass


def test_engine_url_is_sqlite() -> None:
    """Verify that the engine URL contains 'sqlite'."""
    assert "sqlite" in str(engine.url)


def test_base_is_declarative_base() -> None:
    """Verify that Base has a metadata attribute confirming it is a declarative base."""
    assert hasattr(Base, "metadata")
    assert Base.metadata is not None
