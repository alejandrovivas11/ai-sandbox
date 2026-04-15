"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { Card } from "@/components/ui/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { H1, Muted } from "@/components/ui/Typography"
import { usePatients } from "@/hooks/usePatients"
import { getPatients } from "@/lib/api/patients"
import type { Patient } from "@/types/patient"
import { useState, useEffect } from "react"

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-green-100 text-green-700 hover:bg-green-100",
  inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  discharged: "bg-red-100 text-red-700 hover:bg-red-100",
}

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  discharged: "Discharged",
}

export default function PatientsPage() {
  const router = useRouter()
  const [allPatients, setAllPatients] = useState<Patient[]>([])

  useEffect(() => {
    getPatients().then(setAllPatients)
  }, [])

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    therapistFilter,
    setTherapistFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    patients,
    startIndex,
  } = usePatients(allPatients)

  return (
    <div className="flex flex-col flex-1">
      {/* Section 0: Header */}
      <div className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
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
          <H1 className="text-xl font-semibold">Patients</H1>
        </div>
        <Link href="/patients/intake">
          <Button variant="default" size="default">
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Section 1: Search and filter controls */}
      <div className="flex flex-row items-center gap-3 px-6 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search by name, DOB, MRN, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter || "__all__"}
          onValueChange={(v) => setStatusFilter(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="__all__">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={therapistFilter || "__all__"}
          onValueChange={(v) => setTherapistFilter(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
            <SelectValue placeholder="All Therapists" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="__all__">All Therapists</SelectItem>
            <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
            <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
            <SelectItem value="Dr. Wilson">Dr. Wilson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section 2: Card with table */}
      <div className="px-6">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-xs font-medium text-gray-500">Patient Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Date of Birth</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Phone</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Insurance</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Therapist</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="h-10 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/patients/${patient.id}`)}
                >
                  <TableCell className="text-sm font-medium text-gray-900">
                    {patient.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {patient.dateOfBirth}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE_CLASS[patient.status]}
                    >
                      {STATUS_LABEL[patient.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {patient.phone}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {patient.insurance}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {patient.therapist}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Section 3: Pagination */}
      <div className="flex flex-row items-center justify-between px-6 py-4">
        <Muted className="text-sm">
          Showing {startIndex + 1}-{Math.min(startIndex + patients.length, totalResults)} of {totalResults} patients
        </Muted>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          )}
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
