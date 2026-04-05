"""
Tests for JWT authentication: login, token validation, and the /me endpoint.
"""

from fastapi.testclient import TestClient


class TestLogin:
    """Verify login endpoint behaviour for valid and invalid credentials."""

    def test_login_success_returns_jwt_token(self, client: TestClient, seed_admin):
        """POST /api/auth/login returns valid JWT token with 200 status
        when given correct credentials (admin@clinic.com / admin123)."""
        # Arrange
        login_data = {
            "username": "admin@clinic.com",
            "password": "admin123",
        }

        # Act
        response = client.post("/api/auth/login", data=login_data)

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for valid login, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "access_token" in data, (
            f"Response missing 'access_token' field: {data}"
        )
        assert data.get("token_type") == "bearer", (
            f"Expected token_type 'bearer', got {data.get('token_type')}"
        )
        # Token should be a non-empty string
        assert isinstance(data["access_token"], str) and len(data["access_token"]) > 0, (
            "access_token should be a non-empty string"
        )

    def test_login_wrong_password_returns_401(self, client: TestClient, seed_admin):
        """POST /api/auth/login returns 401 status when given correct email
        but wrong password."""
        # Arrange
        login_data = {
            "username": "admin@clinic.com",
            "password": "wrongpassword",
        }

        # Act
        response = client.post("/api/auth/login", data=login_data)

        # Assert
        assert response.status_code == 401, (
            f"Expected 401 for wrong password, got {response.status_code}: {response.text}"
        )

    def test_login_nonexistent_user_returns_401(self, client: TestClient, seed_admin):
        """POST /api/auth/login returns 401 status when given email that
        does not exist in the database."""
        # Arrange
        login_data = {
            "username": "nonexistent@example.com",
            "password": "somepassword",
        }

        # Act
        response = client.post("/api/auth/login", data=login_data)

        # Assert
        assert response.status_code == 401, (
            f"Expected 401 for nonexistent user, got {response.status_code}: {response.text}"
        )


class TestGetMe:
    """Verify the GET /api/auth/me endpoint for authenticated and
    unauthenticated access."""

    def test_get_me_authenticated_returns_user_info(
        self, client: TestClient, auth_headers: dict
    ):
        """GET /api/auth/me returns user information (id, email, full_name,
        is_active) with 200 status when valid JWT token is provided."""
        # Arrange -- auth_headers fixture already provides a valid Bearer token

        # Act
        response = client.get("/api/auth/me", headers=auth_headers)

        # Assert
        assert response.status_code == 200, (
            f"Expected 200 for authenticated /me, got {response.status_code}: {response.text}"
        )
        data = response.json()
        assert "id" in data, "Response missing 'id' field"
        assert data["email"] == "admin@clinic.com", (
            f"Expected email 'admin@clinic.com', got {data.get('email')}"
        )
        assert data["full_name"] == "Admin User", (
            f"Expected full_name 'Admin User', got {data.get('full_name')}"
        )
        assert data["is_active"] is True, (
            f"Expected is_active True, got {data.get('is_active')}"
        )

    def test_get_me_no_token_returns_401(self, client: TestClient, seed_admin):
        """GET /api/auth/me returns 401 status when no Authorization header
        is provided."""
        # Arrange -- no headers

        # Act
        response = client.get("/api/auth/me")

        # Assert
        assert response.status_code == 401, (
            f"Expected 401 without token, got {response.status_code}: {response.text}"
        )

    def test_get_me_invalid_token_returns_401(self, client: TestClient, seed_admin):
        """GET /api/auth/me returns 401 status when invalid or expired JWT
        token is provided."""
        # Arrange
        invalid_headers = {"Authorization": "Bearer invalid.token.value"}

        # Act
        response = client.get("/api/auth/me", headers=invalid_headers)

        # Assert
        assert response.status_code == 401, (
            f"Expected 401 for invalid token, got {response.status_code}: {response.text}"
        )
