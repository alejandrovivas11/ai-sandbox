from sqlalchemy import text
from starlette.testclient import TestClient


def test_client_fixture_returns_test_client(client: TestClient) -> None:
    """Verify the client fixture works by making a GET to '/' and receiving 200."""
    response = client.get("/")
    assert response.status_code == 200


def test_db_fixture_provides_session(db) -> None:
    """Verify the db fixture yields a working session that can execute a query."""
    result = db.execute(text("SELECT 1"))
    row = result.fetchone()
    assert row[0] == 1
