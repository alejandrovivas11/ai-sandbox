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
import { H1, Muted } from "@/components/ui/Typography"
import { ReferralFilters } from "@/components/features/referrals/ReferralFilters"
import { ReferralTable } from "@/components/features/referrals/ReferralTable"
import { BulkActions } from "@/components/features/referrals/BulkActions"
import { useReferrals } from "@/hooks/useReferrals"
import { getReferrals } from "@/lib/api/referrals"
import type { Referral } from "@/types/referral"

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
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Referrals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-between mt-2">
          <div className="flex flex-col">
            <H1 className="text-xl font-semibold">Referral Intake Queue</H1>
            <Muted className="text-sm text-neutral-500">
              Manage incoming referrals, validate completeness, and assign triage priority.
            </Muted>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button variant="default" size="default" asChild>
              <Link href="/patients/intake/new">
                <Plus className="w-4 h-4" />
                Add Referral Manually
              </Link>
            </Button>
            <Button variant="secondary" size="default">
              <Upload className="w-4 h-4" />
              Import Fax Referral
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
          <ReferralTable
            referrals={referrals}
            selectedIds={selectedIds}
            allSelected={allSelected}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
          />
        </Card>
      </div>

      {/* Section 3: Bulk actions (conditional) */}
      <BulkActions
        selectedCount={selectedIds.size}
        onBulkAssign={() => {}}
        onBulkTriage={() => {}}
        onBulkArchive={() => {}}
      />
    </div>
  )
}
