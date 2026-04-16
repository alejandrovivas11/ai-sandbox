export interface PatientDetail {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: string
  patientId: string
  medicalRecordNumber: string
  primaryLanguage: string
  interpreterNeeded: boolean
  avatarInitials: string
  treatmentStatus: string
  category: string
  referringPhysician: string
}

export interface Provider {
  id: string
  name: string
  credentials: string
  role: string
}

export interface Insurance {
  name: string
  authorizationStatus: string
}

export interface Diagnosis {
  icdCode: string
  description: string
  diagnosedDate: string
  status: string
}

export interface Assessment {
  instrument: string
  date: string
  standardScore: number
  percentile: string
  severity: string
}

export interface TreatmentPlan {
  domains: string
  frequency: string
  certificationPeriod: string
  cptCodes: string
}

export interface Caregiver {
  name: string
  relationship: string
  phone: string
  preferredLanguage: string
}

export interface Exercise {
  name: string
  frequency: string
  compliance: string
}

export interface Referral {
  provider: string
  date: string
  reason: string
  status: string
}

export interface Authorization {
  cptCode: string
  authorized: number
  used: number
  remaining: number
  kxStatus: string
}

export interface Session {
  date: string
  time: string
  type: string
  provider: string
}

export interface ProgressNote {
  date: string
  noteType: string
  provider: string
  status: string
}

export interface PatientChartData {
  patient: PatientDetail
  primaryProvider: Provider
  cfSlp: Provider
  insurance: Insurance
  diagnoses: Diagnosis[]
  assessments: Assessment[]
  treatmentPlan: TreatmentPlan
  caregivers: Caregiver[]
  exercises: Exercise[]
  referrals: Referral[]
  authorizations: Authorization[]
  upcomingSessions: Session[]
  progressNotes: ProgressNote[]
}
