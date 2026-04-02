from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db


def test_get_db_yields_session():
    gen = get_db()
    session = next(gen)
    assert isinstance(session, Session)
    try:
        gen.send(None)
    except StopIteration:
        pass


def test_db_session_fixture_works(db_session):
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1
