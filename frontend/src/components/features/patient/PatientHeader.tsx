import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import type { PatientChartData } from "@/types/patient-detail"

interface PatientHeaderProps {
  data: PatientChartData
}

export function PatientHeader({ data }: PatientHeaderProps) {
  const { patient, primaryProvider, cfSlp, insurance } = data

  return (
    <header className="flex flex-col bg-white p-6 border-b border-gray-200">
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

      {/* Avatar + Patient Info */}
      <div className="flex flex-row items-center gap-4 mt-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg bg-indigo-600 text-white">
            {patient.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex flex-row items-center gap-4 text-sm text-gray-600">
            <span>DOB: {patient.dateOfBirth} (Age {patient.age})</span>
            <span>{patient.gender}</span>
            <span>MRN: {patient.medicalRecordNumber}</span>
            <span>Primary Language: {patient.primaryLanguage}</span>
            {patient.interpreterNeeded && (
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Interpreter Needed
              </Badge>
            )}
          </div>
          <div className="flex flex-row items-center gap-2 mt-1">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              {patient.treatmentStatus}
            </Badge>
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              {patient.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Provider Info Bar */}
      <div className="flex flex-row gap-6 mt-4 bg-neutral-900 text-white p-4 rounded-md">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Primary CCC-SLP</span>
          <span className="text-sm font-medium">{primaryProvider.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">CF-SLP</span>
          <span className="text-sm font-medium">{cfSlp.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Insurance</span>
          <span className="text-sm font-medium">{insurance.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Authorization Status</span>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-0.5 w-fit">
            {insurance.authorizationStatus}
          </Badge>
        </div>
      </div>
    </header>
  )
}
