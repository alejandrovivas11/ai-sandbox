export type PatientStatus = 'Active' | 'On Hold' | 'Pending' | 'Discharged' | 'New'

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  primaryDiagnosis: string
  provider: string
  insurance: string
  authStatus: string
  nextAppointment: string
  status: string
  mrn: string
  phone: string
  email?: string
  assignedTherapist?: string
  therapist?: string
}

export interface Provider {
  id: string
  name: string
  credentials?: string
}

export interface InsuranceProvider {
  id: string
  name: string
}

export interface PatientFiltersState {
  search: string
  status: string
  provider: string
}
