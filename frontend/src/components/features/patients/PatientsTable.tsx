'use client'

import { useRouter } from 'next/navigation'
import { Patient, PatientStatus } from '@/types/patient'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'

interface PatientsTableProps {
  patients: Patient[]
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onToggleAll: () => void
}

function getStatusBadgeClasses(status: PatientStatus): string {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700 hover:bg-green-100'
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
    case 'Pending':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
    case 'Discharged':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    case 'New':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100'
    default:
      return ''
  }
}

export function PatientsTable({
  patients,
  selectedIds,
  onToggleSelection,
  onToggleAll,
}: PatientsTableProps) {
  const router = useRouter()
  const allSelected =
    patients.length > 0 && selectedIds.size === patients.length

  return (
    <Card className="border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-b border-gray-200">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => onToggleAll()}
              />
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Patient Name
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Date of Birth
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Phone
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Email
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Insurance
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Assigned Therapist
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              className="h-10 border-b border-gray-100 hover:bg-neutral-50 cursor-pointer"
              onClick={() => router.push(`/patients/${patient.id}`)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(patient.id)}
                  onCheckedChange={() => onToggleSelection(patient.id)}
                />
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusBadgeClasses(patient.status)}
                >
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.dateOfBirth}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.phone}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.email}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.insurance}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.assignedTherapist}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
