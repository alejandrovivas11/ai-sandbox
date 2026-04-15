'use client'

import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
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
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { PatientsTable } from '@/components/features/patients/PatientsTable'
import { usePatients } from '@/hooks/usePatients'

export default function PatientsPage() {
  const {
    patients,
    filters,
    setSearch,
    setStatus,
    setTherapist,
    setInsurance,
    selectedIds,
    toggleSelection,
    toggleAll,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
  } = usePatients()

  const totalPages = Math.max(1, Math.ceil(totalCount / 5))
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * 5 + 1
  const endItem = Math.min(currentPage * 5, totalCount)

  return (
    <div className="flex flex-col">
      {/* render_sequence[0]: header */}
      <header className="flex flex-row items-center justify-between" style={{ padding: '16px 24px' }}>
        <div className="flex flex-col gap-2">
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
          <h1 className="text-2xl font-bold text-neutral-900">Patients</h1>
        </div>
        <Link href="/patients/intake">
          <Button variant="default">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Patient
          </Button>
        </Link>
      </header>

      {/* render_sequence[1]: filter controls */}
      <div className="flex flex-row items-center gap-4" style={{ padding: '16px 24px' }}>
        <div className="w-[300px]">
          <Input
            placeholder="Search by name, DOB, MRN, or phone..."
            leadingIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filters.status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Discharged">Discharged</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="New">New</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.therapist} onValueChange={setTherapist}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Therapist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Therapists</SelectItem>
            <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
            <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
            <SelectItem value="Dr. Lisa Rodriguez">Dr. Lisa Rodriguez</SelectItem>
            <SelectItem value="Dr. David Kim">Dr. David Kim</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.insurance} onValueChange={setInsurance}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insurance</SelectItem>
            <SelectItem value="BlueCross BlueShield">BlueCross BlueShield</SelectItem>
            <SelectItem value="Aetna">Aetna</SelectItem>
            <SelectItem value="Cigna">Cigna</SelectItem>
            <SelectItem value="United Healthcare">United Healthcare</SelectItem>
            <SelectItem value="Medicare">Medicare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* render_sequence[2]: patient table (component) */}
      <div className="mx-6 mb-6">
        <PatientsTable
          patients={patients}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onToggleAll={toggleAll}
        />
      </div>

      {/* render_sequence[3]: pagination */}
      <div className="flex flex-row items-center justify-between" style={{ padding: '16px 24px' }}>
        <span className="text-sm text-neutral-600">
          Showing {startItem}-{endItem} of {totalCount} patients
        </span>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
