export interface Patient {
  id: string
  name: string
  patientId: string
  dateOfBirth: string
  age: number
  primaryDiagnosis: string
  status: string
  provider: string
  payer: string
  authorizationStatus: string
  nextAppointment: string
  diagnosisCategory: string
  serviceType: string
}

export interface Provider {
  id: string
  name: string
}

export interface Payer {
  id: string
  name: string
}

export type PatientStatus = 'referral' | 'intake' | 'evaluation' | 'active_treatment' | 'discharge'
export type AuthorizationStatus = 'Approved' | 'Pending' | 'Denied' | 'Expired'
