"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { H1, Muted } from "@/components/ui/Typography";
import { OnboardingFilters } from "@/components/features/onboarding/OnboardingFilters";
import { PatientOnboardingTable } from "@/components/features/onboarding/PatientOnboardingTable";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import type { OnboardingKPI } from "@/types/onboarding";

const KPI_COLOR_CLASS: Record<string, string> = {
  warning: "border-l-4 border-l-yellow-400",
  primary: "border-l-4 border-l-indigo-500",
  accent: "border-l-4 border-l-purple-500",
  success: "border-l-4 border-l-green-500",
  secondary: "border-l-4 border-l-gray-400",
};

function KPICard({ kpi }: { kpi: OnboardingKPI }) {
  return (
    <Card
      className={`p-5 rounded-xl border border-gray-200 ${KPI_COLOR_CLASS[kpi.color] || ""}`}
    >
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-gray-900">{kpi.label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 leading-tight">
            {kpi.value}
          </span>
          <span className="text-xs font-medium text-gray-500">{kpi.delta}</span>
        </div>
      </div>
    </Card>
  );
}

export default function PatientOnboardingTrackerPage() {
  const { kpis, patients, filters, updateFilter } = useOnboardingData();

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Header */}
      <div className="flex flex-col gap-4 px-6 pt-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Onboarding</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col">
          <H1 className="text-xl font-semibold">Patient Onboarding Tracker</H1>
          <Muted className="text-sm text-neutral-600">
            Track new patient intake through SLP onboarding workflow
          </Muted>
        </div>
      </div>

      {/* Section 1: KPI Grid */}
      <div className="grid grid-cols-6 gap-6 px-6 pb-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Section 2: Filter controls */}
      <div className="px-6 pb-4">
        <OnboardingFilters filters={filters} onFilterChange={updateFilter} />
      </div>

      {/* Section 3: Patient table in card */}
      <div className="px-6 pb-6">
        <Card className="overflow-hidden">
          <PatientOnboardingTable patients={patients} />
        </Card>
      </div>
    </div>
  );
}
