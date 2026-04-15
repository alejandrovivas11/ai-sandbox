'use client'

import { Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@/components/ui/Breadcrumb'
import { PatientsTable } from '@/components/features/patients/PatientsTable'
import { usePatients } from '@/hooks/usePatients'

export default function PatientsPage() {
  const {
    patients,
    filters,
    setSearch,
    setStatus,
    setProvider,
    setInsurance,
    clearFilters,
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isLoading,
  } = usePatients()

  const hasSelection = selectedIds.size > 0
  const hasPatients = patients.length > 0 || isLoading

  return (
    <div className="flex flex-col">
      {/* render_sequence[0]: header */}
      <header className="flex flex-row items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
        </div>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Patient
        </Button>
      </header>

      {/* render_sequence[1]: filter bar */}
      <div className="flex flex-row items-center gap-3 px-6 py-3 bg-gray-50 border-b">
        <div className="flex-1">
          <Input
            placeholder="Search by name, DOB, MRN, or phone..."
            leadingIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filters.status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
            <SelectItem value="waitlist">Waitlist</SelectItem>
            <SelectItem value="evaluation">Evaluation</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.provider} onValueChange={setProvider}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dr_smith">Dr. Smith</SelectItem>
            <SelectItem value="dr_johnson">Dr. Johnson</SelectItem>
            <SelectItem value="dr_williams">Dr. Williams</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.insurance} onValueChange={setInsurance}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
            <SelectItem value="aetna">Aetna</SelectItem>
            <SelectItem value="medicare">Medicare</SelectItem>
            <SelectItem value="medicaid">Medicaid</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* render_sequence[2]: bulk actions bar (hidden by default) */}
      {hasSelection && (
        <div className="flex flex-row items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200">
          <span className="text-sm text-gray-900">
            {selectedIds.size} patients selected
          </span>
          <Button variant="secondary">Export Selected</Button>
          <Button variant="secondary">Assign Provider</Button>
          <Button variant="secondary">Change Status</Button>
        </div>
      )}

      {/* render_sequence[3]: patient data table (component) */}
      {hasPatients && (
        <div className="px-6 py-6">
          <PatientsTable
            patients={patients}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
          />
        </div>
      )}

      {/* render_sequence[4]: empty state (hidden when patients present) */}
      {!hasPatients && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Users className="w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            No patients found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters, or add your first patient to
            get started.
          </p>
          <Button variant="default">Add Patient</Button>
        </div>
      )}
    </div>
  )
}
