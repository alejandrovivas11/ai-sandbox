// Types for the Session SOAP Note feature

export interface GoalProgress {
  id: string
  goalDescription: string
  accuracyPercent: string
  cueingLevel: string
  trials: string
  progressStatus: "Progressing" | "Minimal Progress" | "Mastered"
}

export interface TelehealthFormData {
  platform: string
  patientLocation: string
  providerLocation: string
  caregiverPresent: boolean
  consentConfirmed: boolean
  technologyIssues: string
}

export interface SignatureFormData {
  treatingProvider: string
  supervisingSLP: string
  coSignatureRequired: boolean
}

export interface SessionNoteFormData {
  subdomain: string
  serviceDelivery: string
  cptCode: string
  duration: string
  icdCodes: string
  subjective: string
  objectiveNarrative: string
  assessment: string
  plan: string
  hepProvided: boolean
  hepInstructions: string
  telehealth: TelehealthFormData
  signature: SignatureFormData
  goals: GoalProgress[]
}

export interface PatientInfo {
  id: string
  name: string
  dateOfBirth: string
  sessionDate: string
  insurance: string
  authorizationNumber: string
}

// Backward-compatible types used by older components
export interface GoalData {
  goal: string
  targetBehavior: string
  accuracy: string
  cueingLevel: string
  trials: string
  notes: string
}

export interface TelehealthInfo {
  platform: string
  patientLocation: string
  providerLocation: string
  consentConfirmed: string
  connectivityQuality: string
}

export interface SignatureInfo {
  providerSignature: string
  requiresCosignature: string
  supervisingProvider: string
}

export interface SessionNoteData {
  template: string
  dateOfService: string
  startTime: string
  endTime: string
  duration: string
  serviceType: string
  cptCode: string
  serviceDeliveryMode: string
  patientReport: string
  caregiverPresent: string
  engagementLevel: string
  goals: GoalData[]
  articulationData: string
  clinicalAssessment: string
  nextSessionFocus: string
  treatmentModifications: string
  homeProgramAssigned: string
  caregiverTraining: string
  anticipatedDischarge: string
  telehealth: TelehealthInfo
  signature: SignatureInfo
}

export interface ObjectiveGoal {
  goalTarget: string
  accuracyPercent: string
  cueingLevel: string
  trials: string
  notes: string
}

export interface TelehealthData {
  platform: string
  connectionQuality: string
  patientLocation: string
  providerLocation: string
  clinicalObservations: string
  consentConfirmed: boolean
}
