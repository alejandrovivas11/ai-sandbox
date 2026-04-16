export const COMPLETENESS_STATUSES = [
  { value: "pending_review", label: "Pending Review" },
  { value: "documents_requested", label: "Documents Requested" },
  { value: "ready_for_triage", label: "Ready for Triage" },
  { value: "triaged", label: "Triaged" },
  { value: "scheduled", label: "Scheduled" },
] as const

export const TRIAGE_TIERS = [
  { value: "urgent", label: "Tier 1 - Urgent" },
  { value: "priority", label: "Tier 2 - Priority" },
  { value: "routine", label: "Tier 3 - Routine" },
] as const

export const REFERRAL_SOURCES = [
  { value: "fax_ocr", label: "Fax/OCR" },
  { value: "electronic", label: "Electronic" },
  { value: "phone", label: "Phone" },
  { value: "walk_in", label: "Walk-in" },
  { value: "portal", label: "Portal" },
] as const

export const THERAPIST_OPTIONS = [
  { value: "Sarah Johnson, CCC-SLP", label: "Sarah Johnson, CCC-SLP" },
  { value: "Michael Chen, CCC-SLP", label: "Michael Chen, CCC-SLP" },
  { value: "Lisa Rodriguez, CF-SLP", label: "Lisa Rodriguez, CF-SLP" },
] as const

export const REFERRAL_ACTION_OPTIONS = [
  "View Details",
  "Assign CCC-SLP",
  "Set Triage Tier",
  "Request Missing Documents",
  "Schedule Evaluation",
  "Reject Referral",
] as const

export const COMPLETENESS_CHECKLIST_ITEMS = [
  "Patient Name",
  "Date of Birth",
  "Diagnosis / ICD-10 Code",
  "Referring Provider NPI",
  "Insurance Information",
  "Physician Order",
  "Urgency Level",
] as const
