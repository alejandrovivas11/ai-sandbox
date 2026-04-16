export type ReferralStatus =
  | "pending_review"
  | "documents_requested"
  | "ready_for_triage"
  | "triaged"
  | "scheduled"

export type TriageTier = "urgent" | "priority" | "routine"

export type ReferralSource =
  | "fax_ocr"
  | "electronic"
  | "phone"
  | "walk_in"
  | "portal"

export interface Referral {
  id: string
  patient_name: string
  status: ReferralStatus
  triage_tier: TriageTier
  assigned_slp: string | null
  referring_physician: string
  referral_source: ReferralSource
  primary_diagnosis_icd10: string
  date_received: string
  completeness_score: number
  completeness_total: number
  completeness_percentage: number
  insurance_payer: string
}

export const STATUS_LABEL: Record<ReferralStatus, string> = {
  pending_review: "Pending Review",
  documents_requested: "Documents Requested",
  ready_for_triage: "Ready for Triage",
  triaged: "Triaged",
  scheduled: "Scheduled",
}

export const STATUS_BADGE_VARIANT: Record<ReferralStatus, string> = {
  pending_review: "muted",
  documents_requested: "warning",
  ready_for_triage: "success",
  triaged: "primary",
  scheduled: "success",
}

export const TRIAGE_LABEL: Record<TriageTier, string> = {
  urgent: "Tier 1 - Urgent",
  priority: "Tier 2 - Priority",
  routine: "Tier 3 - Routine",
}

export const TRIAGE_BADGE_VARIANT: Record<TriageTier, string> = {
  urgent: "danger",
  priority: "primary",
  routine: "muted",
}

export const SOURCE_LABEL: Record<ReferralSource, string> = {
  fax_ocr: "Fax/OCR",
  electronic: "Electronic",
  phone: "Phone",
  walk_in: "Walk-in",
  portal: "Portal",
}
