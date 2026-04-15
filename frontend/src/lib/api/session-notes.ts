import type { Patient, SessionNoteData, ObjectiveGoal } from "@/types/session-note"

export function getPatient(): Patient {
  return {
    id: "123",
    name: "Sarah Johnson",
    dateOfBirth: "03/15/2018",
    primaryDiagnosis: "F80.1 - Expressive language disorder",
    avatarUrl: "/avatars/sarah-johnson.jpg",
    authorizationVisitsRemaining: 20,
    specialty: "Language",
  }
}

export function getDefaultObjectiveGoals(): ObjectiveGoal[] {
  return [
    {
      goalTarget: "Initial /s/ sound production",
      accuracyPercent: "75%",
      cueingLevel: "minimal",
      trials: "15/20",
      notes: "Good progress with visual cues",
    },
    {
      goalTarget: "2-word phrase production",
      accuracyPercent: "60%",
      cueingLevel: "moderate",
      trials: "12/20",
      notes: "Improving with modeling",
    },
  ]
}

export function getDefaultSessionNote(): SessionNoteData {
  return {
    patientId: "123",
    sessionDate: "2024-01-15",
    startTime: "09:00",
    endTime: "09:30",
    duration: "30 minutes",
    serviceType: "individual",
    cptCode: "92507",
    clinician: "Jennifer Smith, MS, CCC-SLP",
    supervisingSLP: "dr_johnson",
    serviceDeliveryMode: "in_person",
    subdomain: "articulation",
    subjective:
      "Mother reports that Sarah has been practicing her speech sounds at home using the worksheets provided. She notes improvement in 's' sound production during structured activities but continues to struggle with spontaneous speech.",
    objectiveGoals: getDefaultObjectiveGoals(),
    stimuliMaterials:
      "Picture cards for /s/ words, mirror for visual feedback, reinforcement stickers",
    patientEngagement:
      "Patient was cooperative and engaged throughout the session. Required minimal redirection.",
    assessment:
      "Patient demonstrates good progress in articulation skills with structured practice. Shows ability to self-correct with minimal cueing. Continued skilled intervention needed for generalization to conversational speech.",
    nextSessionFocus:
      "Continue /s/ sound production practice, introduce /s/ blends",
    cueingAdjustments:
      "Reduce visual cues, increase use of auditory discrimination tasks",
    homeProgramUpdates:
      "Continue daily practice with /s/ word lists, add mirror practice",
    referralRecommendations: "None at this time",
    frequencyDurationRecommendations:
      "Continue 2x/week for 30-minute sessions",
  }
}

export async function saveSessionNoteDraft(
  _data: SessionNoteData
): Promise<{ success: boolean }> {
  return { success: true }
}

export async function submitSessionNote(
  _data: SessionNoteData
): Promise<{ success: boolean }> {
  return { success: true }
}
