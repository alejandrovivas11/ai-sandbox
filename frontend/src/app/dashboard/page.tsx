"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";

interface StatCardProps {
  title: string;
  value: number | undefined;
  isLoading: boolean;
}

function StatCard({ title, value, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-xs">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-foreground">
        {isLoading ? "--" : (value ?? 0)}
      </p>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  description: string;
}

function NavLink({ href, label, description }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-background p-4 transition-colors hover:bg-secondary"
    >
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const { stats, isLoading, isError, error } = useDashboard();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Patient management system overview
      </p>

      {isError && (
        <div className="mt-6 rounded-lg border border-destructive bg-destructive-20 p-4">
          <p className="text-sm text-destructive">
            Failed to load dashboard data.{" "}
            {error?.message ?? "An unexpected error occurred."}
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={stats?.total_patients}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Appointments"
          value={stats?.total_appointments}
          isLoading={isLoading}
        />
        <StatCard
          title="Upcoming"
          value={stats?.upcoming_appointments}
          isLoading={isLoading}
        />
        <StatCard
          title="Completed"
          value={stats?.completed_appointments}
          isLoading={isLoading}
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-foreground">
        Quick Navigation
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NavLink
          href="/patients"
          label="Patients"
          description="View and manage patient records"
        />
        <NavLink
          href="/appointments"
          label="Appointments"
          description="Schedule and track appointments"
        />
      </div>
    </div>
  );
}
