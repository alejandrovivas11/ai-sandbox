import type { PatientChartData } from "@/types/patient-detail"

const MOCK_PATIENT_CHART: PatientChartData = {
  patient: {
    id: "PAT-2024-0156",
    name: "Sarah Mitchell",
    dateOfBirth: "03/15/2019",
    age: "4 years, 8 months",
    gender: "Female",
    patientId: "PAT-2024-0156",
    referringPhysician: "Dr. Jennifer Lopez, MD",
    status: "Active",
    authorization: "Authorized",
    reEvalDue: "12/15/24",
  },
  diagnoses: [
    {
      icdCode: "F80.1",
      description: "Expressive language disorder",
      date: "08/15/2024",
      provider: "Dr. Jennifer Lopez",
    },
    {
      icdCode: "F80.2",
      description: "Mixed receptive-expressive language disorder",
      date: "08/15/2024",
      provider: "Dr. Jennifer Lopez",
    },
  ],
  assessments: [
    {
      name: "CELF-5",
      date: "08/20/2024",
      score: 72,
      percentile: "3rd",
      severity: "Moderate",
    },
    {
      name: "PPVT-5",
      date: "08/22/2024",
      score: 85,
      percentile: "16th",
      severity: "Mild",
    },
  ],
  treatmentPlans: [
    { goalDomain: "Expressive Language", activeGoals: 3, status: "In Progress" },
    { goalDomain: "Receptive Language", activeGoals: 2, status: "In Progress" },
    { goalDomain: "Pragmatic Language", activeGoals: 1, status: "In Progress" },
  ],
  sessions: [
    {
      date: "11/15/2024",
      type: "Individual",
      duration: "45 min",
      clinician: "Maria Rodriguez, SLP",
      goalAreas: "Expressive, Receptive",
    },
    {
      date: "11/08/2024",
      type: "Individual",
      duration: "45 min",
      clinician: "Maria Rodriguez, SLP",
      goalAreas: "Pragmatic",
    },
  ],
  caregiver: {
    name: "Jennifer Mitchell",
    relationship: "Mother",
    phone: "(555) 123-4567",
    email: "jennifer.mitchell@email.com",
    preferredLanguage: "English",
    homeProgramParticipation: "Active",
  },
  homePrograms: [
    {
      exercise: "Vocabulary Building Cards",
      frequency: "Daily",
      compliance: "85%",
      lastUpdated: "11/10/2024",
    },
    {
      exercise: "Following Directions Practice",
      frequency: "3x weekly",
      compliance: "70%",
      lastUpdated: "11/12/2024",
    },
  ],
  referrals: [
    {
      source: "Pediatric Associates",
      date: "08/01/2024",
      reason: "Language delay concerns",
      status: "Active",
      followUp: "12/01/2024",
    },
  ],
}

export async function getPatientChart(id: string): Promise<PatientChartData> {
  void id
  return MOCK_PATIENT_CHART
}
