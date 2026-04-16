export interface ChartPatient {
  id: string
  name: string
  dateOfBirth: string
  age: number
  gender: string
  medicalRecordNumber: string
  patientSince: string
  status: string
  avatar: string
  providerId: string
  referringPhysicianId: string
}

export interface ChartProvider {
  id: string
  name: string
  credentials: string
  specialty: string
}

export interface Diagnosis {
  id: string
  patientId: string
  code: string
  description: string
  onsetDate: string
  type: "Primary" | "Secondary"
}

export interface Assessment {
  id: string
  patientId: string
  name: string
  standardScore: number
  percentile: number
  date: string
}

export interface Goal {
  id: string
  name: string
  status: string
}

export interface TreatmentPlan {
  id: string
  patientId: string
  certificationDate: string
  recertDate: string
  goals: Goal[]
}

export interface Session {
  id: string
  patientId: string
  date: string
  type: string
  cptCode: string
  providerId: string
  providerName: string
  duration: string
  noteStatus: string
}

export interface Authorization {
  id: string
  patientId: string
  authNumber: string
  authorizedUnits: number
  usedUnits: number
  expirationDate: string
  status: string
  kxModifierStatus: string
}

export interface Caregiver {
  id: string
  patientId: string
  name: string
  relationship: string
  phone: string
  email: string
  type: "Primary" | "Secondary"
}

export interface HomeProgram {
  id: string
  patientId: string
  name: string
  assignedDate: string
  frequency: string
  compliance: string
  status: string
}

export interface PatientDocument {
  id: string
  patientId: string
  name: string
  type: string
  uploadDate: string
}

export interface ReferralInfo {
  referringProvider: string
  referralDate: string
  reasonForReferral: string
  status: string
}

export interface PatientChartData {
  patient: ChartPatient
  provider: ChartProvider
  referringPhysician: ChartProvider
  diagnoses: Diagnosis[]
  assessments: Assessment[]
  treatmentPlan: TreatmentPlan
  sessions: Session[]
  authorization: Authorization
  caregivers: Caregiver[]
  homePrograms: HomeProgram[]
  documents: PatientDocument[]
  referralInfo: ReferralInfo
}
