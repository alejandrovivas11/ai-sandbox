"use client";

import { useEffect, useState } from "react";
import { getDashboardMetrics } from "@/lib/api/dashboard";
import type { DashboardMetrics } from "@/types/dashboard";

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description?: string;
}): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-xs">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function MetricsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-border bg-white p-6"
        >
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-2 h-8 w-16 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-32 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): React.JSX.Element {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-6"
      role="alert"
      data-testid="error-display"
    >
      <h3 className="font-semibold text-red-800">Failed to load dashboard</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

export default function DashboardRoutePage(): React.JSX.Element {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDashboardMetrics()
      .then((data) => {
        if (!cancelled) {
          setMetrics(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = (): void => {
    setLoading(true);
    setError(null);
    getDashboardMetrics()
      .then((data) => {
        setMetrics(data);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Dashboard</h1>

      {loading && <MetricsSkeleton />}

      {error && !loading && (
        <ErrorDisplay message={error} onRetry={handleRetry} />
      )}

      {metrics && !loading && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Patients"
              value={metrics.patientCount}
              description="Registered patients"
            />
            <MetricCard
              title="Appointments"
              value={metrics.appointmentCount}
              description="Total appointments"
            />
            <MetricCard
              title="Pending"
              value={metrics.pendingAppointments}
              description="Awaiting confirmation"
            />
            <MetricCard
              title="Completed"
              value={metrics.completedAppointments}
              description="Finished appointments"
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
            {metrics.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            ) : (
              <div className="rounded-lg border border-border bg-white">
                {metrics.recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
