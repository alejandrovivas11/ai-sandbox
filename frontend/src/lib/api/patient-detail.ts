import type { PatientChartData } from "@/types/patient-detail"

const mockPatientChart: PatientChartData = {
  patient: {
    id: "PAT-2024-0156",
    firstName: "Sarah",
    lastName: "Chen",
    dateOfBirth: "03/15/2019",
    age: 4,
    gender: "Female",
    patientId: "PAT-2024-0156",
    medicalRecordNumber: "12345678",
    primaryLanguage: "English",
    interpreterNeeded: true,
    avatarInitials: "SC",
    treatmentStatus: "Active Treatment",
    category: "Pediatric",
    referringPhysician: "Dr. Smith",
  },
  primaryProvider: {
    id: "PROV-001",
    name: "Dr. Maria Rodriguez",
    credentials: "CCC-SLP",
    role: "Primary CCC-SLP",
  },
  cfSlp: {
    id: "PROV-002",
    name: "Jessica Wang, MS",
    credentials: "CF-SLP",
    role: "CF-SLP",
  },
  insurance: {
    name: "Blue Cross Blue Shield",
    authorizationStatus: "Active",
  },
  diagnoses: [
    {
      icdCode: "F80.1",
      description: "Expressive language disorder",
      diagnosedDate: "01/15/2024",
      status: "Active",
    },
    {
      icdCode: "F80.2",
      description: "Mixed receptive-expressive language disorder",
      diagnosedDate: "01/15/2024",
      status: "Active",
    },
  ],
  assessments: [
    {
      instrument: "CELF-5",
      date: "01/20/2024",
      standardScore: 75,
      percentile: "5th",
      severity: "Moderate",
    },
    {
      instrument: "PLS-5",
      date: "01/22/2024",
      standardScore: 72,
      percentile: "3rd",
      severity: "Severe",
    },
  ],
  treatmentPlan: {
    domains: "Expressive Language, Receptive Language",
    frequency: "2x/week, 45 minutes",
    certificationPeriod: "02/01/2024 - 07/31/2024",
    cptCodes: "92507, 92508",
  },
  caregivers: [
    {
      name: "Lisa Chen",
      relationship: "Mother",
      phone: "(555) 123-4567",
      preferredLanguage: "Mandarin",
    },
    {
      name: "David Chen",
      relationship: "Father",
      phone: "(555) 123-4568",
      preferredLanguage: "English",
    },
  ],
  exercises: [
    {
      name: "Picture Naming",
      frequency: "Daily, 10 min",
      compliance: "85%",
    },
    {
      name: "Following Directions",
      frequency: "2x daily",
      compliance: "60%",
    },
  ],
  referrals: [
    {
      provider: "Dr. Smith (Pediatrics)",
      date: "01/10/2024",
      reason: "Language delay concerns",
      status: "Completed",
    },
  ],
  authorizations: [
    {
      cptCode: "92507",
      authorized: 24,
      used: 8,
      remaining: 16,
      kxStatus: "Below Threshold",
    },
  ],
  upcomingSessions: [
    {
      date: "03/15/2024",
      time: "10:00 AM",
      type: "Individual Therapy",
      provider: "Jessica Wang, CF-SLP",
    },
    {
      date: "03/18/2024",
      time: "2:00 PM",
      type: "Individual Therapy",
      provider: "Jessica Wang, CF-SLP",
    },
  ],
  progressNotes: [
    {
      date: "03/10/2024",
      noteType: "Treatment Note",
      provider: "Jessica Wang, CF-SLP",
      status: "Signed",
    },
    {
      date: "03/08/2024",
      noteType: "Progress Report",
      provider: "Dr. Maria Rodriguez",
      status: "Draft",
    },
  ],
}

export async function getPatientChart(patientId: string): Promise<PatientChartData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ...mockPatientChart, patient: { ...mockPatientChart.patient, id: patientId } }
}
