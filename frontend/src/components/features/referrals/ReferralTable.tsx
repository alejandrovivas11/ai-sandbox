"use client"

import Link from "next/link"
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
import { ReferralActionsDropdown } from "@/components/features/referrals/ReferralActionsDropdown"
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

interface ReferralTableProps {
  referrals: Referral[]
  selectedIds: Set<string>
  allSelected: boolean
  onToggleSelection: (id: string) => void
  onToggleAll: () => void
}

export function ReferralTable({
  referrals,
  selectedIds,
  allSelected,
  onToggleSelection,
  onToggleAll,
}: ReferralTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="w-[40px]">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => onToggleAll()}
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
                onCheckedChange={() => onToggleSelection(referral.id)}
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
  )
}
