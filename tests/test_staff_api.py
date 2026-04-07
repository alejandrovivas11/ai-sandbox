"""Tests for the staff API endpoints."""


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root_returns_running_message(self, client):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "AI Sandbox is running"}


class TestCreateStaff:
    """Tests for POST /staff."""

    def test_create_staff_success(self, client, sample_staff_data):
        response = client.post("/staff", json=sample_staff_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_staff_data["name"]
        assert data["email"] == sample_staff_data["email"]
        assert data["role"] == sample_staff_data["role"]
        assert data["team"] == sample_staff_data["team"]
        assert data["status"] == sample_staff_data["status"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_staff_duplicate_email(self, client, sample_staff_data):
        client.post("/staff", json=sample_staff_data)
        response = client.post("/staff", json=sample_staff_data)
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    def test_create_staff_missing_required_field(self, client):
        incomplete_data = {
            "name": "Bob",
            "email": "bob@example.com",
            # missing role, team, hire_date
        }
        response = client.post("/staff", json=incomplete_data)
        assert response.status_code == 422


class TestListStaff:
    """Tests for GET /staff."""

    def test_list_staff_empty(self, client):
        response = client.get("/staff")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_staff_returns_created(self, client, sample_staff_data):
        client.post("/staff", json=sample_staff_data)
        response = client.get("/staff")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["email"] == sample_staff_data["email"]

    def test_list_staff_filter_by_role(self, client, sample_staff_data):
        client.post("/staff", json=sample_staff_data)
        # Create a second staff member with a different role
        other = sample_staff_data.copy()
        other["email"] = "bob@example.com"
        other["name"] = "Bob Smith"
        other["role"] = "Manager"
        client.post("/staff", json=other)

        response = client.get("/staff", params={"role": "Manager"})
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["role"] == "Manager"

    def test_list_staff_filter_by_team(self, client, sample_staff_data):
        client.post("/staff", json=sample_staff_data)
        response = client.get("/staff", params={"team": "Backend"})
        assert response.status_code == 200
        assert len(response.json()) == 1

        response = client.get("/staff", params={"team": "Frontend"})
        assert response.status_code == 200
        assert len(response.json()) == 0

    def test_list_staff_search(self, client, sample_staff_data):
        client.post("/staff", json=sample_staff_data)
        response = client.get("/staff", params={"search": "Alice"})
        assert response.status_code == 200
        assert len(response.json()) == 1

        response = client.get("/staff", params={"search": "nonexistent"})
        assert response.status_code == 200
        assert len(response.json()) == 0

    def test_list_staff_pagination(self, client, sample_staff_data):
        # Create multiple staff members
        for i in range(5):
            data = sample_staff_data.copy()
            data["email"] = f"user{i}@example.com"
            data["name"] = f"User {i}"
            client.post("/staff", json=data)

        response = client.get("/staff", params={"skip": 0, "limit": 2})
        assert response.status_code == 200
        assert len(response.json()) == 2

        response = client.get("/staff", params={"skip": 3, "limit": 10})
        assert response.status_code == 200
        assert len(response.json()) == 2


class TestGetStaff:
    """Tests for GET /staff/{staff_id}."""

    def test_get_staff_by_id(self, client, sample_staff_data):
        create_resp = client.post("/staff", json=sample_staff_data)
        staff_id = create_resp.json()["id"]

        response = client.get(f"/staff/{staff_id}")
        assert response.status_code == 200
        assert response.json()["email"] == sample_staff_data["email"]

    def test_get_staff_not_found(self, client):
        response = client.get("/staff/9999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestUpdateStaff:
    """Tests for PUT /staff/{staff_id}."""

    def test_update_staff_success(self, client, sample_staff_data):
        create_resp = client.post("/staff", json=sample_staff_data)
        staff_id = create_resp.json()["id"]

        update_data = {"name": "Alice Updated", "role": "Senior Engineer"}
        response = client.put(f"/staff/{staff_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Alice Updated"
        assert data["role"] == "Senior Engineer"
        # Unchanged fields should remain
        assert data["email"] == sample_staff_data["email"]
        assert data["team"] == sample_staff_data["team"]

    def test_update_staff_not_found(self, client):
        response = client.put("/staff/9999", json={"name": "Ghost"})
        assert response.status_code == 404

    def test_update_staff_partial(self, client, sample_staff_data):
        create_resp = client.post("/staff", json=sample_staff_data)
        staff_id = create_resp.json()["id"]

        response = client.put(f"/staff/{staff_id}", json={"status": "inactive"})
        assert response.status_code == 200
        assert response.json()["status"] == "inactive"


class TestDeleteStaff:
    """Tests for DELETE /staff/{staff_id}."""

    def test_delete_staff_success(self, client, sample_staff_data):
        create_resp = client.post("/staff", json=sample_staff_data)
        staff_id = create_resp.json()["id"]

        response = client.delete(f"/staff/{staff_id}")
        assert response.status_code == 204

        # Verify it's gone
        response = client.get(f"/staff/{staff_id}")
        assert response.status_code == 404

    def test_delete_staff_not_found(self, client):
        response = client.delete("/staff/9999")
        assert response.status_code == 404
