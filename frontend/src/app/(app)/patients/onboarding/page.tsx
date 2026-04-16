"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Download } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { H1, Muted } from "@/components/ui/Typography"
import { PatientOnboardingFilters } from "@/components/features/onboarding/PatientOnboardingFilters"
import { PatientOnboardingTable } from "@/components/features/onboarding/PatientOnboardingTable"
import { usePatientOnboarding } from "@/hooks/usePatientOnboarding"
import {
  getOnboardingPatients,
  getOnboardingKPIs,
} from "@/lib/api/patient-onboarding"
import type { OnboardingPatient } from "@/types/patient-onboarding"
import type { OnboardingKPI } from "@/types/patient-onboarding"

const KPI_COLOR_CLASS: Record<string, string> = {
  warning: "border-l-4 border-l-yellow-400",
  primary: "border-l-4 border-l-indigo-500",
  accent: "border-l-4 border-l-purple-500",
  success: "border-l-4 border-l-green-500",
  secondary: "border-l-4 border-l-gray-400",
}

const TREND_COLOR: Record<string, string> = {
  "+": "text-green-600",
  "-": "text-red-600",
}

function getTrendColor(trend: string): string {
  if (trend.startsWith("+")) return TREND_COLOR["+"]
  if (trend.startsWith("-")) return TREND_COLOR["-"]
  return "text-gray-500"
}

export default function PatientOnboardingTrackerPage() {
  const [allPatients, setAllPatients] = useState<OnboardingPatient[]>([])
  const [kpis, setKpis] = useState<OnboardingKPI[]>([])

  useEffect(() => {
    getOnboardingPatients().then(setAllPatients)
    getOnboardingKPIs().then(setKpis)
  }, [])

  const {
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    triageFilter,
    setTriageFilter,
    slpFilter,
    setSlpFilter,
    sourceFilter,
    setSourceFilter,
    patients,
  } = usePatientOnboarding(allPatients)

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Header */}
      <div className="flex flex-col px-6 pt-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Onboarding Tracker</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-between mt-2">
          <div className="flex flex-col">
            <H1 className="text-xl font-semibold">Patient Onboarding Tracker</H1>
            <Muted className="text-sm text-neutral-600">
              Track new patient intake, SLP case history, insurance verification, and authorization status.
            </Muted>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button variant="default" size="default">
              <Plus className="w-4 h-4" />
              Add New Patient
            </Button>
            <Button variant="secondary" size="default">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: KPI Grid */}
      <div className="grid grid-cols-5 gap-6 px-6 pb-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className={`p-5 rounded-xl border border-gray-200 ${KPI_COLOR_CLASS[kpi.color] || ""}`}
          >
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-900">{kpi.title}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 leading-tight">
                  {kpi.value}
                </span>
                <span className={`text-xs font-medium ${getTrendColor(kpi.trend)}`}>
                  {kpi.trend}
                </span>
              </div>
              <span className="text-xs text-gray-400">{kpi.description}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Section 2: Filter controls */}
      <PatientOnboardingFilters
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
        triageFilter={triageFilter}
        onTriageChange={setTriageFilter}
        slpFilter={slpFilter}
        onSlpChange={setSlpFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
      />

      {/* Section 3: Patient table in card */}
      <div className="px-6 pb-6">
        <Card className="overflow-hidden">
          <PatientOnboardingTable patients={patients} />
        </Card>
      </div>
    </div>
  )
}
