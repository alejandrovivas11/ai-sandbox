export type PatientStatus = "active" | "inactive" | "discharged" | "Active" | "On Hold" | "Discharged" | "Pending" | "New" | "Inactive"

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  status: PatientStatus
  phone: string
  insurance: string
  therapist: string
  mrn: string
  email: string
  assignedTherapist?: string
}

export interface Therapist {
  id: string
  name: string
}

export interface Provider {
  id: string
  name: string
}

export interface InsuranceProvider {
  id: string
  name: string
}
