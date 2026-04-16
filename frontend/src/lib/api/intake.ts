import type {
  IntakeFormData,
  AdultIntakeFormData,
  IntakeProgressStep,
} from "@/types/intake"

export const INTAKE_PROGRESS_STEPS: IntakeProgressStep[] = [
  { number: 1, label: "Demographics", status: "completed" },
  { number: 2, label: "Insurance & Referral", status: "active" },
  { number: 3, label: "Communication Concerns", status: "incomplete" },
  { number: 4, label: "Medical History", status: "incomplete" },
  { number: 5, label: "Screening Tools", status: "incomplete" },
  { number: 6, label: "Consent & Signatures", status: "incomplete" },
]

export const PEDIATRIC_FORM_DATA: IntakeFormData = {
  id: "intake-001",
  patientId: "patient-001",
  formType: "pediatric",
  status: "in_progress",
  demographics: {
    firstName: "Emma",
    middleName: "Rose",
    lastName: "Johnson",
    dateOfBirth: "2020-03-15",
    gender: "Female",
    primaryLanguage: "English",
    caregiverName: "Sarah Johnson",
    caregiverPhone: "(555) 123-4567",
    caregiverEmail: "sarah.johnson@email.com",
    interpreterNeeded: false,
    preferredCommunicationMode: "Verbal",
  },
  insurance: {
    insuranceProvider: "Blue Cross Blue Shield",
    policyNumber: "BCBS123456789",
    groupNumber: "GRP001",
    referringPhysician: "Dr. Michael Peterson",
    physicianNpi: "1234567890",
    referralDate: "2024-01-15",
  },
  communicationConcerns: {
    articulationSpeechSounds: true,
    expressiveLanguage: true,
    receptiveLanguage: false,
    fluencyStuttering: false,
    voiceQuality: false,
    swallowingFeeding: true,
    descriptionOfConcerns:
      "Emma has difficulty with /r/ and /s/ sounds. She also shows limited vocabulary for her age and has some feeding difficulties with solid foods.",
  },
  developmentalMilestones: {
    ageAtFirstWords: "18 months",
    ageAtFirstSentences: "Not yet achieved",
    birthHistory: "Full-term, no complications",
    earlyFeedingHistory: "Breastfed with some difficulty",
  },
  hearingStatus: {
    recentHearingScreen: "Pass",
    lastHearingEvaluation: "2023-12-01",
    hearingDevices: "None",
  },
  medicalHistory: {
    currentMedications: "None",
    relevantDiagnoses: "Expressive language delay, feeding difficulties",
    previousSlpTherapy: "Yes",
  },
  screeningTools: {
    eat10Score: "8/40",
    eat10Interpretation: "Mild dysphagia risk",
    vhi10Score: "",
    vhi10Interpretation: "",
  },
  consent: {
    consentToTreatment: true,
    hipaaNpp: true,
    audioVideoRecording: true,
    telehealthConsent: false,
    caregiverSignature: "Sarah Johnson",
    signatureDate: "2024-01-20",
  },
  createdAt: "2024-01-20T10:00:00Z",
  completedAt: null,
}

export const ADULT_FORM_DATA: AdultIntakeFormData = {
  demographics: {
    firstName: "Robert",
    middleName: "James",
    lastName: "Smith",
    dateOfBirth: "1965-08-22",
    gender: "Male",
    primaryLanguage: "English",
  },
  voiceConcerns: {
    hoarseness: true,
    vocalFatigue: true,
    lossOfVocalRange: false,
    throatClearing: true,
  },
  swallowingAssessment: {
    currentIddsiDietLevel: "Level 5 - Minced & Moist",
    currentIddsiDrinkLevel: "Level 2 - Mildly Thick",
  },
  screeningTools: {
    eat10Score: "15/40",
    eat10Interpretation: "Moderate dysphagia risk",
    vhi10Score: "22/40",
    vhi10Interpretation: "Moderate voice impairment",
  },
}

export async function saveIntakeDraft(
  data: IntakeFormData
): Promise<{ success: boolean }> {
  // Mock API call
  return { success: true }
}

export async function submitIntakeForm(
  data: IntakeFormData
): Promise<{ success: boolean }> {
  // Mock API call
  return { success: true }
}
