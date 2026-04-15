export type PatientStatus = 'active' | 'discharged' | 'waitlist' | 'evaluation' | 'referral'

export interface Patient {
  id: string
  name: string
  email: string
  mrn: string
  dateOfBirth: string
  age: number
  status: PatientStatus
  primaryProvider: string
  insurance: string
  lastVisit: string
  nextAppointment: string | null
}

export interface Provider {
  id: string
  name: string
}

export interface InsuranceProvider {
  id: string
  name: string
}
