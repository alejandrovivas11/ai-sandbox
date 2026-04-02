import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Mock the api client module
vi.mock("../api/client", () => ({
  default: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

function TestConsumer() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "unauthenticated"}
      </span>
      <button
        onClick={() => login("test@example.com", "password")}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

function renderAuthConsumer() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("test_login_stores_token_in_localstorage", async () => {
    const { default: apiClient } = await import("../api/client");
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { access_token: "test-jwt-token", token_type: "bearer" },
    });

    renderAuthConsumer();

    await act(async () => {
      screen.getByTestId("login-btn").click();
    });

    expect(localStorage.getItem("token")).toBe("test-jwt-token");
    expect(screen.getByTestId("auth-status").textContent).toBe(
      "authenticated"
    );
  });

  test("test_logout_clears_token", async () => {
    localStorage.setItem("token", "existing-token");

    renderAuthConsumer();

    expect(screen.getByTestId("auth-status").textContent).toBe(
      "authenticated"
    );

    act(() => {
      screen.getByTestId("logout-btn").click();
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      "unauthenticated"
    );
  });

  test("test_is_authenticated_reflects_token_presence", () => {
    // No token - should be unauthenticated
    const { unmount } = renderAuthConsumer();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      "unauthenticated"
    );
    unmount();

    // With token - should be authenticated
    localStorage.setItem("token", "some-token");
    renderAuthConsumer();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      "authenticated"
    );
  });
});
