import type { PatientDetail } from "@/types/patient-detail"

interface PatientDemographicsProps {
  patient: PatientDetail
}

export function PatientDemographics({ patient }: PatientDemographicsProps) {
  return (
    <div className="flex flex-row gap-6 mt-4">
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Date of Birth</span>
        <span className="text-sm text-gray-900">{patient.dateOfBirth}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Age</span>
        <span className="text-sm text-gray-900">{patient.age}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Gender</span>
        <span className="text-sm text-gray-900">{patient.gender}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Patient ID</span>
        <span className="text-sm text-gray-900">{patient.patientId}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Referring Physician</span>
        <span className="text-sm text-gray-900">{patient.referringPhysician}</span>
      </div>
    </div>
  )
}
