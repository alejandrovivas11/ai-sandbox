"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { H1 } from "@/components/ui/Typography"
import { PatientFilters } from "@/components/features/patients/PatientFilters"
import { PatientTable } from "@/components/features/patients/PatientTable"
import { PatientPagination } from "@/components/features/patients/PatientPagination"
import { usePatients } from "@/hooks/usePatients"
import { getPatients } from "@/lib/api/patients"
import type { Patient } from "@/types/patient"
import { useState, useEffect } from "react"

export default function PatientsPage() {
  const [allPatients, setAllPatients] = useState<Patient[]>([])

  useEffect(() => {
    getPatients().then(setAllPatients)
  }, [])

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    providerFilter,
    setProviderFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    patients,
    startIndex,
  } = usePatients(allPatients)

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Header with breadcrumb and title row */}
      <div className="flex flex-col gap-1 px-6 pt-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Patients</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-between">
          <H1 className="text-2xl font-semibold text-gray-900">Patients</H1>
          <Link href="/patients/intake/new">
            <Button variant="default" size="default">
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Section 1: Filter controls */}
      <PatientFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        providerFilter={providerFilter}
        onProviderChange={setProviderFilter}
      />

      {/* Section 2: Patient table in card */}
      <div className="px-6">
        <Card className="overflow-hidden">
          <PatientTable patients={patients} />
        </Card>
      </div>

      {/* Section 3: Pagination */}
      <PatientPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        startIndex={startIndex}
        pageSize={5}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
