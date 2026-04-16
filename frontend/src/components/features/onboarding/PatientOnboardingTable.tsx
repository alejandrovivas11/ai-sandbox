"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import type { OnboardingPatient, OnboardingStepStatus } from "@/types/onboarding";
import { cn } from "@/lib/utils";

function getStepBadgeClasses(status: OnboardingStepStatus): string {
  switch (status) {
    case "Complete":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Not Started":
      return "bg-gray-100 text-gray-500 hover:bg-gray-100";
    case "Issue":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "Ready to Schedule":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-500 hover:bg-gray-100";
  }
}

function getPriorityBadgeClasses(priority: string): string {
  switch (priority) {
    case "Tier 1 Urgent":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "Tier 2 Priority":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Tier 3 Routine":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-500 hover:bg-gray-100";
  }
}

const actionMenuItems = [
  "View Patient Details",
  "Edit Onboarding",
  "Send Case History Form",
  "Run SLP VOB",
  "Request SLP Eval PA",
  "Schedule SLP Evaluation",
  "Set Triage Priority",
  "Upload Referral",
];

interface PatientOnboardingTableProps {
  patients: OnboardingPatient[];
}

export function PatientOnboardingTable({ patients }: PatientOnboardingTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-xs font-medium text-gray-500">Patient Name</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Triage Priority</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Primary Concern</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Referral Date</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Date of Birth</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Caregiver/Guardian</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Insurance/Payer</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Referral Source</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Referral Validation</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">SLP Case History</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">VOB (SLP Benefits)</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">PA (SLP Eval Codes)</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Scheduling Status</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Assigned SLP</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Days in Onboarding</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="h-10 border-b border-gray-100">
              <TableCell className="text-sm">
                <Link
                  href={`/patients/${patient.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  {patient.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getPriorityBadgeClasses(patient.triagePriority))}
                >
                  {patient.triagePriority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-700">{patient.primaryConcern}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.referralDate}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.dateOfBirth}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.caregiverGuardian}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.insurancePayer}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.referralSource}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getStepBadgeClasses(patient.steps.referralValidation))}
                >
                  {patient.steps.referralValidation}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getStepBadgeClasses(patient.steps.slpCaseHistory))}
                >
                  {patient.steps.slpCaseHistory}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getStepBadgeClasses(patient.steps.vobSlpBenefits))}
                >
                  {patient.steps.vobSlpBenefits}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getStepBadgeClasses(patient.steps.paSlpEvalCodes))}
                >
                  {patient.steps.paSlpEvalCodes}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", getStepBadgeClasses(patient.steps.schedulingStatus))}
                >
                  {patient.steps.schedulingStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-700">{patient.assignedSLP}</TableCell>
              <TableCell className="text-sm text-gray-700">{patient.daysInOnboarding}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    {actionMenuItems.map((item) => (
                      <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
