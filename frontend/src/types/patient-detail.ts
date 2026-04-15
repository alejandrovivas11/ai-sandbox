export interface PatientDetail {
  id: string
  name: string
  dateOfBirth: string
  age: string
  gender: string
  patientId: string
  referringPhysician: string
  status: string
  authorization: string
  reEvalDue: string
}

export interface Diagnosis {
  icdCode: string
  description: string
  date: string
  provider: string
}

export interface Assessment {
  name: string
  date: string
  score: number
  percentile: string
  severity: string
}

export interface TreatmentPlan {
  goalDomain: string
  activeGoals: number
  status: string
}

export interface Session {
  date: string
  type: string
  duration: string
  clinician: string
  goalAreas: string
}

export interface Caregiver {
  name: string
  relationship: string
  phone: string
  email: string
  preferredLanguage: string
  homeProgramParticipation: string
}

export interface HomeProgram {
  exercise: string
  frequency: string
  compliance: string
  lastUpdated: string
}

export interface Referral {
  source: string
  date: string
  reason: string
  status: string
  followUp: string
}

export interface PatientChartData {
  patient: PatientDetail
  diagnoses: Diagnosis[]
  assessments: Assessment[]
  treatmentPlans: TreatmentPlan[]
  sessions: Session[]
  caregiver: Caregiver
  homePrograms: HomeProgram[]
  referrals: Referral[]
}
