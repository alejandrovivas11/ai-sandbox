import type {
  PatientInfo,
  SessionNoteFormData,
  GoalProgress,
  SessionNoteData,
} from "@/types/session-note"

export function getPatient(): PatientInfo {
  return {
    id: "12345",
    name: "Sarah Johnson",
    dateOfBirth: "03/15/2018",
    sessionDate: "01/15/2024",
    insurance: "Aetna PPO",
    authorizationNumber: "AUTH-2024-0892",
  }
}

export function getDefaultGoals(): GoalProgress[] {
  return [
    {
      id: "g1",
      goalDescription: "Two-word utterances for requesting",
      accuracyPercent: "75%",
      cueingLevel: "Direct Cue",
      trials: "15/20",
      progressStatus: "Progressing",
    },
    {
      id: "g2",
      goalDescription: "Action + object combinations",
      accuracyPercent: "60%",
      cueingLevel: "Model",
      trials: "12/20",
      progressStatus: "Minimal Progress",
    },
    {
      id: "g3",
      goalDescription: "Spontaneous labeling of familiar objects",
      accuracyPercent: "85%",
      cueingLevel: "Independent",
      trials: "17/20",
      progressStatus: "Mastered",
    },
  ]
}

export function getDefaultSessionNoteForm(): SessionNoteFormData {
  return {
    subdomain: "expressive_language",
    serviceDelivery: "in_person",
    cptCode: "92507",
    duration: "60",
    icdCodes: "F80.1, F80.2",
    subjective: "",
    objectiveNarrative: "",
    assessment: "",
    plan: "",
    hepProvided: true,
    hepInstructions: "",
    telehealth: {
      platform: "",
      patientLocation: "",
      providerLocation: "",
      caregiverPresent: false,
      consentConfirmed: false,
      technologyIssues: "",
    },
    signature: {
      treatingProvider: "Jessica Martinez, CF-SLP",
      supervisingSLP: "Dr. Sarah Chen, CCC-SLP",
      coSignatureRequired: true,
    },
    goals: getDefaultGoals(),
  }
}

// Backward-compatible function for old hook
export function getDefaultSessionNote(): SessionNoteData {
  return {
    template: "Expressive Language",
    dateOfService: "2024-01-15",
    startTime: "09:00",
    endTime: "10:00",
    duration: "60 min",
    serviceType: "Individual Treatment",
    cptCode: "92507",
    serviceDeliveryMode: "In-Person",
    patientReport: "",
    caregiverPresent: "No",
    engagementLevel: "Good",
    goals: [
      {
        goal: "Expressive Language Goal 1",
        targetBehavior: "Two-word utterances",
        accuracy: "75%",
        cueingLevel: "Direct Cue",
        trials: "15/20",
        notes: "",
      },
      {
        goal: "Expressive Language Goal 2",
        targetBehavior: "Action + object combos",
        accuracy: "60%",
        cueingLevel: "Model",
        trials: "12/20",
        notes: "",
      },
    ],
    articulationData: "",
    clinicalAssessment: "",
    nextSessionFocus: "",
    treatmentModifications: "",
    homeProgramAssigned: "",
    caregiverTraining: "No",
    anticipatedDischarge: "",
    telehealth: {
      platform: "N/A - In-Person",
      patientLocation: "",
      providerLocation: "",
      consentConfirmed: "N/A",
      connectivityQuality: "N/A",
    },
    signature: {
      providerSignature: "Jessica Martinez, CF-SLP",
      requiresCosignature: "Yes - CF-SLP",
      supervisingProvider: "",
    },
  }
}

export async function saveSessionNoteDraft(
  data: SessionNoteFormData | SessionNoteData
): Promise<void> {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function submitSessionNote(
  data: SessionNoteFormData | SessionNoteData
): Promise<void> {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}
