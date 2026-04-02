def test_health_endpoint_returns_200(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint_still_works(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
