"use client"

import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu"
import type { OnboardingPatient } from "@/types/patient-onboarding"
import {
  TRIAGE_BADGE_VARIANT,
  STAGE_BADGE_VARIANT,
  CASE_HISTORY_BADGE_VARIANT,
  VOB_BADGE_VARIANT,
  PA_BADGE_VARIANT,
} from "@/types/patient-onboarding"

const BADGE_CLASS: Record<string, string> = {
  warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  danger: "bg-red-100 text-red-700 hover:bg-red-100",
  success: "bg-green-100 text-green-700 hover:bg-green-100",
  primary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  muted: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  secondary: "bg-gray-100 text-gray-600 hover:bg-gray-100",
}

function StatusBadge({ label, variant }: { label: string; variant: string }) {
  return (
    <Badge variant="outline" className={BADGE_CLASS[variant] || BADGE_CLASS.muted}>
      {label}
    </Badge>
  )
}

interface PatientOnboardingTableProps {
  patients: OnboardingPatient[]
}

export function PatientOnboardingTable({ patients }: PatientOnboardingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-xs font-medium text-gray-500">Patient Name</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">DOB / Age</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Triage Priority</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Referral Source</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Onboarding Stage</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Case History</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">VOB Status</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">PA Status</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Assigned SLP</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Days in Stage</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Referral Date</TableHead>
          <TableHead className="text-xs font-medium text-gray-500 text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id} className="border-b border-gray-100 h-10">
            <TableCell>
              <Link
                href={`/patients/${patient.id}`}
                className="text-sm font-medium text-neutral-900 hover:underline"
              >
                {patient.name}
              </Link>
            </TableCell>
            <TableCell className="text-sm text-neutral-600">
              {patient.dob} ({patient.age})
            </TableCell>
            <TableCell>
              <StatusBadge
                label={patient.triagePriority}
                variant={TRIAGE_BADGE_VARIANT[patient.triagePriority]}
              />
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.referralSource}
            </TableCell>
            <TableCell>
              <StatusBadge
                label={patient.onboardingStage}
                variant={STAGE_BADGE_VARIANT[patient.onboardingStage]}
              />
            </TableCell>
            <TableCell>
              <StatusBadge
                label={patient.caseHistoryStatus}
                variant={CASE_HISTORY_BADGE_VARIANT[patient.caseHistoryStatus]}
              />
            </TableCell>
            <TableCell>
              <StatusBadge
                label={patient.vobStatus}
                variant={VOB_BADGE_VARIANT[patient.vobStatus]}
              />
            </TableCell>
            <TableCell>
              <StatusBadge
                label={patient.paStatus}
                variant={PA_BADGE_VARIANT[patient.paStatus]}
              />
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.assignedSlp}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.daysInStage}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.referralDate}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Send Case History Form</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
