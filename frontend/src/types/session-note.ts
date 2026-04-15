export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  primaryDiagnosis: string
  avatarUrl: string
  authorizationVisitsRemaining: number
  specialty: string
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

export interface SessionNoteData {
  patientId: string
  sessionDate: string
  startTime: string
  endTime: string
  duration: string
  serviceType: string
  cptCode: string
  clinician: string
  supervisingSLP: string
  serviceDeliveryMode: string
  subdomain: string
  subjective: string
  objectiveGoals: ObjectiveGoal[]
  stimuliMaterials: string
  patientEngagement: string
  assessment: string
  nextSessionFocus: string
  cueingAdjustments: string
  homeProgramUpdates: string
  referralRecommendations: string
  frequencyDurationRecommendations: string
  telehealth?: TelehealthData
}
