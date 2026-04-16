export type TriagePriority = "Tier 1 Urgent" | "Tier 2 Priority" | "Tier 3 Routine"

export type OnboardingStage =
  | "Referral Received"
  | "Case History Collection"
  | "VOB in Progress"
  | "PA Requested"
  | "Eval Scheduled"
  | "Onboarding Complete"

export type CaseHistoryStatus = "Not Started" | "Pending" | "Complete"
export type VobStatus = "Not Started" | "In Progress" | "Approved"
export type PaStatus = "Not Required" | "Pending" | "Approved"

export type ReferralSource =
  | "Physician"
  | "School"
  | "Self-referral"
  | "Hospital"
  | "Other Provider"

export interface OnboardingPatient {
  id: string
  name: string
  dob: string
  age: string
  triagePriority: TriagePriority
  referralSource: ReferralSource
  onboardingStage: OnboardingStage
  caseHistoryStatus: CaseHistoryStatus
  vobStatus: VobStatus
  paStatus: PaStatus
  assignedSlp: string
  daysInStage: number
  referralDate: string
}

export interface OnboardingKPI {
  title: string
  value: string
  trend: string
  color: string
  description: string
}

export const TRIAGE_BADGE_VARIANT: Record<TriagePriority, string> = {
  "Tier 1 Urgent": "danger",
  "Tier 2 Priority": "warning",
  "Tier 3 Routine": "secondary",
}

export const STAGE_BADGE_VARIANT: Record<OnboardingStage, string> = {
  "Referral Received": "muted",
  "Case History Collection": "warning",
  "VOB in Progress": "primary",
  "PA Requested": "primary",
  "Eval Scheduled": "success",
  "Onboarding Complete": "success",
}

export const CASE_HISTORY_BADGE_VARIANT: Record<CaseHistoryStatus, string> = {
  "Not Started": "muted",
  "Pending": "warning",
  "Complete": "success",
}

export const VOB_BADGE_VARIANT: Record<VobStatus, string> = {
  "Not Started": "muted",
  "In Progress": "primary",
  "Approved": "success",
}

export const PA_BADGE_VARIANT: Record<PaStatus, string> = {
  "Not Required": "muted",
  "Pending": "warning",
  "Approved": "success",
}
