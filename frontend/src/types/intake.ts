export interface IntakeFormData {
  id: string
  patientId: string
  formType: "pediatric" | "adult"
  status: "draft" | "in_progress" | "completed"
  demographics: DemographicsData
  insurance: InsuranceData
  communicationConcerns: CommunicationConcernsData
  developmentalMilestones: DevelopmentalMilestonesData
  hearingStatus: HearingStatusData
  medicalHistory: MedicalHistoryData
  screeningTools: ScreeningToolsData
  consent: ConsentData
  createdAt: string
  completedAt: string | null
}

export interface DemographicsData {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  primaryLanguage: string
  caregiverName: string
  caregiverPhone: string
  caregiverEmail: string
  interpreterNeeded: boolean
  preferredCommunicationMode: string
}

export interface InsuranceData {
  insuranceProvider: string
  policyNumber: string
  groupNumber: string
  referringPhysician: string
  physicianNpi: string
  referralDate: string
}

export interface CommunicationConcernsData {
  articulationSpeechSounds: boolean
  expressiveLanguage: boolean
  receptiveLanguage: boolean
  fluencyStuttering: boolean
  voiceQuality: boolean
  swallowingFeeding: boolean
  descriptionOfConcerns: string
}

export interface DevelopmentalMilestonesData {
  ageAtFirstWords: string
  ageAtFirstSentences: string
  birthHistory: string
  earlyFeedingHistory: string
}

export interface HearingStatusData {
  recentHearingScreen: string
  lastHearingEvaluation: string
  hearingDevices: string
}

export interface MedicalHistoryData {
  currentMedications: string
  relevantDiagnoses: string
  previousSlpTherapy: string
}

export interface ScreeningToolsData {
  eat10Score: string
  eat10Interpretation: string
  vhi10Score: string
  vhi10Interpretation: string
}

export interface ConsentData {
  consentToTreatment: boolean
  hipaaNpp: boolean
  audioVideoRecording: boolean
  telehealthConsent: boolean
  caregiverSignature: string
  signatureDate: string
}

export interface AdultIntakeFormData {
  demographics: {
    firstName: string
    middleName: string
    lastName: string
    dateOfBirth: string
    gender: string
    primaryLanguage: string
  }
  voiceConcerns: {
    hoarseness: boolean
    vocalFatigue: boolean
    lossOfVocalRange: boolean
    throatClearing: boolean
  }
  swallowingAssessment: {
    currentIddsiDietLevel: string
    currentIddsiDrinkLevel: string
  }
  screeningTools: ScreeningToolsData
}

export interface IntakeProgressStep {
  number: number
  label: string
  status: "completed" | "active" | "incomplete"
}
