"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { TableRow, TableCell } from "@/components/ui/Table"
import type { Patient } from "@/types/patient"

interface PatientTableRowProps {
  patient: Patient
}

export function PatientTableRow({ patient }: PatientTableRowProps) {
  return (
    <TableRow className="h-10 border-b border-gray-100">
      <TableCell className="text-sm text-gray-700">
        <Link
          href={`/patients/${patient.id}`}
          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
        >
          {patient.name}
        </Link>
      </TableCell>
      <TableCell className="text-sm text-gray-700">
        {patient.dateOfBirth}
      </TableCell>
      <TableCell>
        {patient.status === "Active" ? (
          <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0">
            Inactive
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-sm text-gray-700">{patient.phone}</TableCell>
      <TableCell className="text-sm text-gray-700">{patient.email}</TableCell>
      <TableCell className="text-sm text-gray-700">{patient.insurance}</TableCell>
      <TableCell className="text-right">
        <div className="flex flex-row gap-2 justify-end">
          <Button variant="secondary" size="sm">
            View
          </Button>
          <Button size="sm">Edit</Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
