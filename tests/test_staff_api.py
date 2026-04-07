"""Tests for staff API endpoints."""


def _create_staff(client, **overrides):
    """Helper to create a staff member via API."""
    payload = {
        "name": "Test User",
        "role": "Physician",
        "department": "Primary Care",
        "email": "test@3yhealth.com",
        "phone": "(555) 000-0000",
        "status": "Active",
        "hireDate": "2023-01-15T00:00:00",
    }
    payload.update(overrides)
    return client.post("/api/staff", json=payload)


class TestListStaff:
    def test_list_empty(self, client):
        response = client.get("/api/staff")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_returns_created(self, client):
        _create_staff(client)
        response = client.get("/api/staff")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Test User"

    def test_search_by_name(self, client):
        _create_staff(client, name="Sarah Chen", email="sarah@test.com")
        _create_staff(client, name="James Rod", email="james@test.com")
        response = client.get("/api/staff", params={"search": "sarah"})
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Sarah Chen"

    def test_search_by_email(self, client):
        _create_staff(client, name="A", email="unique@test.com")
        _create_staff(client, name="B", email="other@test.com")
        response = client.get("/api/staff", params={"search": "unique"})
        data = response.json()
        assert len(data) == 1
        assert data[0]["email"] == "unique@test.com"

    def test_filter_by_role(self, client):
        _create_staff(client, role="Physician", email="a@test.com")
        _create_staff(client, role="Nurse", email="b@test.com")
        response = client.get("/api/staff", params={"role": "Physician"})
        data = response.json()
        assert len(data) == 1
        assert data[0]["role"] == "Physician"

    def test_filter_by_department(self, client):
        _create_staff(client, department="Emergency", email="a@test.com")
        _create_staff(client, department="Surgery", email="b@test.com")
        response = client.get("/api/staff", params={"department": "Emergency"})
        data = response.json()
        assert len(data) == 1
        assert data[0]["department"] == "Emergency"


class TestGetStaff:
    def test_get_existing(self, client):
        create_resp = _create_staff(client)
        staff_id = create_resp.json()["id"]
        response = client.get(f"/api/staff/{staff_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Test User"

    def test_get_not_found(self, client):
        response = client.get("/api/staff/999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


class TestCreateStaff:
    def test_create_success(self, client):
        response = _create_staff(client)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test User"
        assert data["role"] == "Physician"
        assert data["department"] == "Primary Care"
        assert data["email"] == "test@3yhealth.com"
        assert data["status"] == "Active"
        assert "id" in data

    def test_create_minimal(self, client):
        payload = {
            "name": "Minimal User",
            "role": "Nurse",
            "department": "ER",
            "email": "minimal@test.com",
        }
        response = client.post("/api/staff", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "Active"

    def test_create_missing_required_field(self, client):
        payload = {"name": "Incomplete"}
        response = client.post("/api/staff", json=payload)
        assert response.status_code == 422


class TestUpdateStaff:
    def test_update_success(self, client):
        create_resp = _create_staff(client)
        staff_id = create_resp.json()["id"]
        response = client.put(
            f"/api/staff/{staff_id}",
            json={"name": "Updated Name", "status": "Inactive"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["status"] == "Inactive"
        assert data["role"] == "Physician"

    def test_update_not_found(self, client):
        response = client.put("/api/staff/999", json={"name": "Ghost"})
        assert response.status_code == 404

    def test_update_partial(self, client):
        create_resp = _create_staff(client)
        staff_id = create_resp.json()["id"]
        response = client.put(
            f"/api/staff/{staff_id}",
            json={"department": "Cardiology"},
        )
        assert response.status_code == 200
        assert response.json()["department"] == "Cardiology"
        assert response.json()["name"] == "Test User"
