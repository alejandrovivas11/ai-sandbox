import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { DashboardMetrics, ActivityItem } from "@/types/dashboard";
import { ApiError, fetchApi } from "@/lib/api";
import { getDashboardMetrics } from "@/lib/api/dashboard";

// Mock next/navigation for Navigation component
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockMetrics: DashboardMetrics = {
  patientCount: 150,
  appointmentCount: 45,
  pendingAppointments: 12,
  completedAppointments: 33,
  recentActivity: [
    {
      id: "1",
      type: "appointment",
      description: "New appointment scheduled",
      timestamp: "2026-04-07T10:00:00Z",
    },
    {
      id: "2",
      type: "patient",
      description: "New patient registered",
      timestamp: "2026-04-07T09:30:00Z",
    },
  ],
};

describe("Dashboard TypeScript interfaces", () => {
  it("should define DashboardMetrics with required fields", () => {
    const metrics: DashboardMetrics = mockMetrics;
    expect(metrics.patientCount).toBe(150);
    expect(metrics.appointmentCount).toBe(45);
    expect(metrics.pendingAppointments).toBe(12);
    expect(metrics.completedAppointments).toBe(33);
    expect(metrics.recentActivity).toHaveLength(2);
  });

  it("should define ActivityItem with required fields", () => {
    const item: ActivityItem = mockMetrics.recentActivity[0];
    expect(item.id).toBe("1");
    expect(item.type).toBe("appointment");
    expect(item.description).toBe("New appointment scheduled");
    expect(item.timestamp).toBe("2026-04-07T10:00:00Z");
  });
});

describe("API client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should fetch data from the correct URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMetrics),
    });

    const result = await fetchApi<DashboardMetrics>("/dashboard");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/dashboard",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual(mockMetrics);
  });

  it("should throw ApiError on non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchApi("/dashboard")).rejects.toThrow(ApiError);

    const error = await fetchApi("/dashboard").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(500);
  });

  it("should create ApiError with correct properties", () => {
    const error = new ApiError(404, "Not Found");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not Found");
    expect(error.name).toBe("ApiError");
    expect(error).toBeInstanceOf(Error);
  });
});

describe("Dashboard API client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = jest.fn();
  });

  it("should call getDashboardMetrics and return typed data", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMetrics),
    });

    const result = await getDashboardMetrics();
    expect(result.patientCount).toBe(150);
    expect(result.appointmentCount).toBe(45);
    expect(result.recentActivity).toHaveLength(2);
  });
});

describe("Navigation component", () => {
  it("should render navigation links", async () => {
    const Navigation = (await import("@/components/Navigation")).default;
    render(<Navigation />);

    expect(screen.getByText("3Y Health")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Patients")).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });

  it("should have correct link hrefs", async () => {
    const Navigation = (await import("@/components/Navigation")).default;
    render(<Navigation />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    const patientsLink = screen.getByText("Patients").closest("a");
    const appointmentsLink = screen.getByText("Appointments").closest("a");

    expect(dashboardLink).toHaveAttribute("href", "/");
    expect(patientsLink).toHaveAttribute("href", "/patients");
    expect(appointmentsLink).toHaveAttribute("href", "/appointments");
  });
});

describe("Dashboard page", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("should show loading state initially", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const DashboardPage = (await import("@/app/page")).default;
    render(<DashboardPage />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    const pulsingElements = document.querySelectorAll(".animate-pulse");
    expect(pulsingElements.length).toBeGreaterThan(0);
  });

  it("should display metrics after successful fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMetrics),
    });

    const DashboardPage = (await import("@/app/page")).default;
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("150")).toBeInTheDocument();
    });

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("33")).toBeInTheDocument();
    expect(
      screen.getByText("New appointment scheduled")
    ).toBeInTheDocument();
  });

  it("should display error state on API failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const DashboardPage = (await import("@/app/page")).default;
    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load dashboard")
      ).toBeInTheDocument();
    });
  });
});
