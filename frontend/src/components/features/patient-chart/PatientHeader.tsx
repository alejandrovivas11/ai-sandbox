"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import type { ChartPatient, ChartProvider, Authorization } from "@/types/patient-chart"

interface PatientHeaderProps {
  patient: ChartPatient
  provider: ChartProvider
  referringPhysician: ChartProvider
  authorization: Authorization
}

export function PatientHeader({
  patient,
  provider,
  referringPhysician,
  authorization,
}: PatientHeaderProps) {
  const remainingVisits = authorization.authorizedUnits - authorization.usedUnits

  return (
    <header className="flex flex-col gap-6 pb-6 border-b border-gray-200">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Patient Chart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Patient info row */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">ES</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.name}
            </h1>
            <div className="flex flex-row gap-2 items-center text-sm">
              <span className="text-muted-foreground">
                DOB: {patient.dateOfBirth} (Age {patient.age})
              </span>
              <span className="text-neutral-500">&bull;</span>
              <span className="text-muted-foreground">{patient.gender}</span>
              <span className="text-neutral-500">&bull;</span>
              <span className="text-muted-foreground">
                MRN: {patient.medicalRecordNumber}
              </span>
              <span className="text-neutral-500">&bull;</span>
              <span className="text-muted-foreground">
                Patient Since: {patient.patientSince}
              </span>
              <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                {patient.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row gap-2">
          <Link href={`/notes/new?patient_id=${patient.id}`}>
            <Button>New Progress Note</Button>
          </Link>
          <Link href={`/patients/${patient.id}/evaluation/new`}>
            <Button variant="secondary">New Evaluation</Button>
          </Link>
          <Button variant="outline">Edit Patient</Button>
        </div>
      </div>

      {/* Provider info row */}
      <div className="flex flex-row gap-8">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            CCC-SLP Provider
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {provider.name}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            Referring Physician
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {referringPhysician.name}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            Insurance/Auth Status
          </span>
          <div className="flex flex-row items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
              Active
            </Badge>
            <span className="text-sm text-muted-foreground">
              {remainingVisits}/{authorization.authorizedUnits} visits remaining
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
