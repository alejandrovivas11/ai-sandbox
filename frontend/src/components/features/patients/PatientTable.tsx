"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import type { Patient } from "@/types/patient"

interface PatientTableProps {
  patients: Patient[]
}

function getAuthBadgeClass(authStatus: string): string {
  switch (authStatus) {
    case "Authorized":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "Pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "Review Required":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "Expired":
      return "bg-red-100 text-red-700 hover:bg-red-100"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Active Treatment":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "Waitlist":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "Maintenance":
      return "bg-gray-100 text-gray-600 hover:bg-gray-100"
    case "Discharged":
      return "bg-gray-100 text-gray-500 hover:bg-gray-100"
    case "Follow-up":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

export function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-xs font-medium text-gray-500">Patient Name</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Date of Birth</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Primary Diagnosis</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Insurance/Payer</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Auth Status</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Next Appointment</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow
            key={patient.id}
            className="h-10 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/patients/${patient.id}`)}
          >
            <TableCell className="text-sm font-medium text-gray-900">
              {patient.name}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.dateOfBirth}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.primaryDiagnosis}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.provider}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.insurance}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getAuthBadgeClass(patient.authStatus)}>
                {patient.authStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {patient.nextAppointment}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStatusBadgeClass(patient.status)}>
                {patient.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
