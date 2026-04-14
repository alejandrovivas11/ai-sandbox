'use client'

import { Plus } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PatientListTable } from '@/components/features/patients/PatientListTable'

export default function PatientsPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      {/* Header: render_sequence[0] - inline */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Patients</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">SLP Patient Registry</h1>
            <Badge variant="secondary">142 patients</Badge>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {/* Content card: render_sequence[1] - component */}
      <PatientListTable />
    </main>
  )
}
