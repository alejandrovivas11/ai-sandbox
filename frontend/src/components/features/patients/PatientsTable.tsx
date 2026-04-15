'use client'

import { Patient, PatientStatus } from '@/types/patient'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu'
import { MoreVertical } from 'lucide-react'

interface PatientsTableProps {
  patients: Patient[]
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onToggleAll: () => void
}

function getStatusBadgeVariant(status: PatientStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default'
    case 'evaluation':
      return 'secondary'
    case 'discharged':
      return 'outline'
    case 'waitlist':
      return 'secondary'
    case 'referral':
      return 'secondary'
    default:
      return 'default'
  }
}

function getStatusBadgeClasses(status: PatientStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 hover:bg-green-100'
    case 'evaluation':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
    case 'discharged':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    case 'waitlist':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
    case 'referral':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100'
    default:
      return ''
  }
}

function formatStatusLabel(status: PatientStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function PatientsTable({
  patients,
  selectedIds,
  onToggleSelection,
  onToggleAll,
}: PatientsTableProps) {
  const allSelected = patients.length > 0 && selectedIds.size === patients.length

  return (
    <Card className="border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-b border-gray-200">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => onToggleAll()}
              />
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Name</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">MRN</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Date of Birth</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Primary Provider</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Insurance</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Last Visit</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Next Appointment</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              className="h-10 border-b border-gray-100"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(patient.id)}
                  onCheckedChange={() => onToggleSelection(patient.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {patient.name}
                  </span>
                  <span className="text-xs text-gray-500">{patient.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.mrn}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">
                    {patient.dateOfBirth}
                  </span>
                  <span className="text-xs text-gray-500">
                    Age {patient.age}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusBadgeClasses(patient.status)}
                >
                  {formatStatusLabel(patient.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.primaryProvider}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.insurance}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.lastVisit}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {patient.nextAppointment ?? '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                    <DropdownMenuItem>Discharge Patient</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
