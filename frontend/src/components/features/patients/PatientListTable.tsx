'use client'

import { Card, CardContent } from '@/components/ui/Card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { PAGE_SIZE_OPTIONS } from '@/lib/api/patients'
import { usePatients } from '@/hooks/usePatients'
import { PatientFilters } from '@/components/features/patients/PatientFilters'
import { PatientTableRow } from '@/components/features/patients/PatientTableRow'

export function PatientListTable() {
  const {
    patients,
    totalPatients,
    filters,
    setSearch,
    setStatus,
    setProvider,
    setPayer,
    setDiagnosisCategory,
    setServiceType,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = usePatients()

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 pt-6">
        {/* Filters */}
        <PatientFilters
          search={filters.search}
          onSearchChange={setSearch}
          status={filters.status}
          onStatusChange={setStatus}
          provider={filters.provider}
          onProviderChange={setProvider}
          payer={filters.payer}
          onPayerChange={setPayer}
          diagnosisCategory={filters.diagnosisCategory}
          onDiagnosisCategoryChange={setDiagnosisCategory}
          serviceType={filters.serviceType}
          onServiceTypeChange={setServiceType}
        />

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Patient</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">DOB</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Primary Diagnosis</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Payer</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Auth Status</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Next Appointment</TableHead>
              <TableHead className="w-[80px] text-right text-xs font-medium text-gray-500" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <PatientTableRow key={patient.id} patient={patient} />
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <span className="text-sm text-gray-700">Show:</span>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">of {totalPatients} patients</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Button variant="ghost" size="sm" disabled={page === 1}>
              Previous
            </Button>
            {[1, 2, 3].map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="ghost" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
