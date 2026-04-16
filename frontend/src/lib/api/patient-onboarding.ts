import type { OnboardingPatient, OnboardingKPI } from "@/types/patient-onboarding"

const MOCK_KPIS: OnboardingKPI[] = [
  {
    title: "Pending Referrals",
    value: "12",
    trend: "+3",
    color: "warning",
    description: "New referrals awaiting triage",
  },
  {
    title: "Awaiting Case History",
    value: "8",
    trend: "-2",
    color: "primary",
    description: "Patients pending intake forms",
  },
  {
    title: "VOB/PA In Progress",
    value: "15",
    trend: "+1",
    color: "accent",
    description: "Insurance verification pending",
  },
  {
    title: "Ready to Schedule",
    value: "6",
    trend: "+4",
    color: "success",
    description: "Cleared for evaluation",
  },
  {
    title: "Total Active",
    value: "41",
    trend: "+6",
    color: "secondary",
    description: "All patients in onboarding",
  },
]

const MOCK_PATIENTS: OnboardingPatient[] = [
  {
    id: "p-001",
    name: "Emma Rodriguez",
    dob: "03/15/2018",
    age: "5y",
    triagePriority: "Tier 1 Urgent",
    referralSource: "Physician",
    onboardingStage: "Case History Collection",
    caseHistoryStatus: "Pending",
    vobStatus: "Not Started",
    paStatus: "Not Required",
    assignedSlp: "Dr. Maria Chen",
    daysInStage: 3,
    referralDate: "11/15/2024",
  },
  {
    id: "p-002",
    name: "Michael Chen",
    dob: "07/22/2020",
    age: "4y",
    triagePriority: "Tier 2 Priority",
    referralSource: "School",
    onboardingStage: "VOB in Progress",
    caseHistoryStatus: "Complete",
    vobStatus: "In Progress",
    paStatus: "Not Required",
    assignedSlp: "Sarah Thompson",
    daysInStage: 7,
    referralDate: "11/11/2024",
  },
  {
    id: "p-003",
    name: "Sophia Williams",
    dob: "12/03/2016",
    age: "7y",
    triagePriority: "Tier 1 Urgent",
    referralSource: "Hospital",
    onboardingStage: "Eval Scheduled",
    caseHistoryStatus: "Complete",
    vobStatus: "Approved",
    paStatus: "Approved",
    assignedSlp: "James Rodriguez",
    daysInStage: 2,
    referralDate: "11/16/2024",
  },
  {
    id: "p-004",
    name: "Jacob Martinez",
    dob: "09/10/2019",
    age: "5y",
    triagePriority: "Tier 3 Routine",
    referralSource: "Self-referral",
    onboardingStage: "PA Requested",
    caseHistoryStatus: "Complete",
    vobStatus: "Approved",
    paStatus: "Pending",
    assignedSlp: "Emily Park",
    daysInStage: 5,
    referralDate: "11/13/2024",
  },
  {
    id: "p-005",
    name: "Ava Johnson",
    dob: "05/28/2017",
    age: "7y",
    triagePriority: "Tier 2 Priority",
    referralSource: "Other Provider",
    onboardingStage: "Referral Received",
    caseHistoryStatus: "Not Started",
    vobStatus: "Not Started",
    paStatus: "Not Required",
    assignedSlp: "Dr. Maria Chen",
    daysInStage: 1,
    referralDate: "11/17/2024",
  },
]

export async function getOnboardingPatients(): Promise<OnboardingPatient[]> {
  return MOCK_PATIENTS
}

export async function getOnboardingKPIs(): Promise<OnboardingKPI[]> {
  return MOCK_KPIS
}
