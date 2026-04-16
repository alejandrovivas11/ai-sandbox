"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Upload, Download } from "lucide-react"
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import { H1, Muted } from "@/components/ui/Typography"
import { ReferralFilters } from "@/components/features/referrals/ReferralFilters"
import { ReferralActionsDropdown } from "@/components/features/referrals/ReferralActionsDropdown"
import { useReferrals } from "@/hooks/useReferrals"
import { getReferrals } from "@/lib/api/referrals"
import type { Referral } from "@/types/referral"
import {
  STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  TRIAGE_LABEL,
  TRIAGE_BADGE_VARIANT,
  SOURCE_LABEL,
} from "@/types/referral"

const BADGE_CLASS: Record<string, string> = {
  warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  danger: "bg-red-100 text-red-700 hover:bg-red-100",
  success: "bg-green-100 text-green-700 hover:bg-green-100",
  primary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  muted: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  secondary: "bg-gray-100 text-gray-600 hover:bg-gray-100",
}

function getCompletenessColor(percentage: number): string {
  if (percentage > 80) return "text-green-600"
  if (percentage >= 50) return "text-yellow-600"
  return "text-red-600"
}

export default function ReferralIntakeQueuePage() {
  const [allReferrals, setAllReferrals] = useState<Referral[]>([])

  useEffect(() => {
    getReferrals().then(setAllReferrals)
  }, [])

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    assignedFilter,
    setAssignedFilter,
    triageFilter,
    setTriageFilter,
    sourceFilter,
    setSourceFilter,
    referrals,
    selectedIds,
    toggleSelection,
    toggleAll,
    allSelected,
  } = useReferrals(allReferrals)

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Header */}
      <div className="flex flex-col px-6 pt-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Referrals</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Intake Queue</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-between mt-2">
          <div className="flex flex-col">
            <H1 className="text-xl font-semibold">Referral Intake Queue</H1>
            <Muted className="text-sm text-neutral-600">
              Incoming physician referrals pending triage and intake processing
            </Muted>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button variant="default" size="default">
              <Plus className="w-4 h-4" />
              Add Referral Manually
            </Button>
            <Button variant="secondary" size="default">
              <Upload className="w-4 h-4" />
              Import Fax Referral
            </Button>
            <Button variant="ghost" size="default">
              <Download className="w-4 h-4" />
              Export Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Filters toolbar */}
      <ReferralFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        assignedFilter={assignedFilter}
        onAssignedChange={setAssignedFilter}
        triageFilter={triageFilter}
        onTriageChange={setTriageFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
      />

      {/* Section 2: Card with table */}
      <div className="px-6 pb-6">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => toggleAll()}
                  />
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Patient Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Intake Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Triage Tier</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Assigned CCC-SLP</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Referring Physician</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Referral Source</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Primary Diagnosis (ICD-10)</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Date Received</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Completeness</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Insurance / Payer</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow
                  key={referral.id}
                  className="h-10 border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="w-[40px]">
                    <Checkbox
                      checked={selectedIds.has(referral.id)}
                      onCheckedChange={() => toggleSelection(referral.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900">
                    <Link
                      href="/patients/intake"
                      className="hover:underline"
                    >
                      {referral.patient_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={BADGE_CLASS[STATUS_BADGE_VARIANT[referral.status]] || ""}
                    >
                      {STATUS_LABEL[referral.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={BADGE_CLASS[TRIAGE_BADGE_VARIANT[referral.triage_tier]] || ""}
                    >
                      {TRIAGE_LABEL[referral.triage_tier]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {referral.assigned_slp || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {referral.referring_physician}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={BADGE_CLASS["secondary"]}
                    >
                      {SOURCE_LABEL[referral.referral_source]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {referral.primary_diagnosis_icd10}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {referral.date_received}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        {referral.completeness_score}/{referral.completeness_total}
                      </span>
                      <span className={`text-sm font-medium ${getCompletenessColor(referral.completeness_percentage)}`}>
                        {referral.completeness_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {referral.insurance_payer}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <ReferralActionsDropdown />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
