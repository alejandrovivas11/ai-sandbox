import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import App from "../App";

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("App routes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("test_login_route_renders_login_page", () => {
    renderWithRouter(["/login"]);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("test_protected_route_redirects_to_login_when_unauthenticated", () => {
    renderWithRouter(["/dashboard"]);
    // Should redirect to /login, so we see the Login heading instead of Dashboard
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("test_all_routes_defined", () => {
    // Test /login renders
    const { unmount: u1 } = renderWithRouter(["/login"]);
    expect(screen.getByText("Login")).toBeInTheDocument();
    u1();

    // Set token so protected routes render
    localStorage.setItem("token", "test-token");

    // Test /dashboard renders
    const { unmount: u2 } = renderWithRouter(["/dashboard"]);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    u2();

    // Test /patients renders
    const { unmount: u3 } = renderWithRouter(["/patients"]);
    expect(screen.getByText("Patients")).toBeInTheDocument();
    u3();

    // Test /patients/:id renders
    const { unmount: u4 } = renderWithRouter(["/patients/123"]);
    expect(screen.getByText("Patient Detail: 123")).toBeInTheDocument();
    u4();

    // Test /appointments renders
    const { unmount: u5 } = renderWithRouter(["/appointments"]);
    expect(screen.getByText("Appointments")).toBeInTheDocument();
    u5();

    localStorage.clear();
  });
});
