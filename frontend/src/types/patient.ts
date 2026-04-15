export type PatientStatus = 'Active' | 'On Hold' | 'Discharged' | 'Pending' | 'New' | 'Inactive'

export interface Patient {
  id: string
  name: string
  status: PatientStatus
  dateOfBirth: string
  phone: string
  email: string
  insurance: string
  assignedTherapist: string
  mrn: string
}

export interface Provider {
  id: string
  name: string
}

export interface InsuranceProvider {
  id: string
  name: string
}
