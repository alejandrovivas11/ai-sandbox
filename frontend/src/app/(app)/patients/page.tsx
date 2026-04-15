"use client"

import Link from "next/link"
import { Plus, ArrowUpDown } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/Table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/Pagination"
import { usePatients } from "@/hooks/usePatients"
import { PatientFilters } from "@/components/features/patients/PatientFilters"
import { PatientTableRow } from "@/components/features/patients/PatientTableRow"
import type { Patient } from "@/types/patient"

const SORTABLE_COLUMNS: { key: keyof Patient; label: string }[] = [
  { key: "name", label: "Patient Name" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "status", label: "Status" },
  { key: "insurance", label: "Insurance" },
]

const NON_SORTABLE_COLUMNS = ["Phone", "Email", "Actions"]

export default function PatientsPage() {
  const {
    patients,
    totalCount,
    setSearch,
    setStatus,
    setInsurance,
    sortField,
    sortDirection,
    toggleSort,
  } = usePatients()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Section 0: Header */}
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
          <h1 className="text-2xl font-semibold text-neutral-900">Patients</h1>
        </div>
        <Link href="/patients/intake">
          <Button>
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Section 1: Search and Filters */}
      <PatientFilters
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onInsuranceChange={setInsurance}
      />

      {/* Section 2: Card with Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="h-10 border-b border-gray-200">
              {SORTABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-xs font-medium text-gray-500 cursor-pointer select-none"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </span>
                </TableHead>
              ))}
              {NON_SORTABLE_COLUMNS.map((label) => (
                <TableHead
                  key={label}
                  className={`text-xs font-medium text-gray-500${
                    label === "Actions" ? " text-right" : ""
                  }`}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <PatientTableRow key={patient.id} patient={patient} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Section 3: Pagination */}
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing 1-{patients.length} of {totalCount} patients
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="pointer-events-none opacity-50"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">50</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
