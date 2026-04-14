'use client'

import type { Patient } from '@/types/patient'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TableRow, TableCell } from '@/components/ui/Table'

interface PatientTableRowProps {
  patient: Patient
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Active Treatment':
    case 'Approved':
      return 'default'
    case 'Evaluation':
    case 'Pending':
      return 'secondary'
    case 'Denied':
    case 'Expired':
      return 'destructive'
    default:
      return 'outline'
  }
}

function getStatusClasses(status: string): string {
  switch (status) {
    case 'Active Treatment':
    case 'Approved':
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50'
    case 'Evaluation':
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
    default:
      return ''
  }
}

export function PatientTableRow({ patient }: PatientTableRowProps) {
  return (
    <TableRow className="border-b border-gray-100">
      <TableCell className="w-[40px]">
        <Checkbox />
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">{patient.name}</span>
          <span className="text-xs text-muted-foreground">ID: {patient.patientId}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm text-gray-700">{patient.dateOfBirth}</span>
          <span className="text-xs text-muted-foreground">{patient.age} years old</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-700">{patient.primaryDiagnosis}</TableCell>
      <TableCell>
        <Badge
          variant={getStatusVariant(patient.status)}
          className={getStatusClasses(patient.status)}
        >
          {patient.status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-700">{patient.provider}</TableCell>
      <TableCell className="text-sm text-gray-700">{patient.payer}</TableCell>
      <TableCell>
        <Badge
          variant={getStatusVariant(patient.authorizationStatus)}
          className={getStatusClasses(patient.authorizationStatus)}
        >
          {patient.authorizationStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-700">{patient.nextAppointment}</TableCell>
      <TableCell className="w-[80px] text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="ghost" size="sm">Edit</Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
