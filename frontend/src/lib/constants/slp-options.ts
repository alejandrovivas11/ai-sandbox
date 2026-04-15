export const SLP_SUBDOMAIN_OPTIONS = [
  { value: "articulation", label: "Articulation" },
  { value: "language", label: "Language" },
  { value: "fluency", label: "Fluency" },
  { value: "voice", label: "Voice" },
  { value: "dysphagia", label: "Dysphagia" },
] as const

export const SERVICE_TYPE_OPTIONS = [
  { value: "individual", label: "Individual Therapy" },
  { value: "group", label: "Group Therapy" },
] as const

export const CPT_CODE_OPTIONS = [
  { value: "92507", label: "92507 - Speech/Language Therapy" },
  { value: "92508", label: "92508 - Speech/Language Therapy (Group)" },
] as const

export const SUPERVISING_SLP_OPTIONS = [
  { value: "dr_johnson", label: "Dr. Lisa Johnson, CCC-SLP" },
  { value: "ms_davis", label: "Ms. Maria Davis, CCC-SLP" },
] as const

export const SERVICE_DELIVERY_MODE_OPTIONS = [
  { value: "in_person", label: "In-Person" },
  { value: "telehealth", label: "Telehealth" },
] as const

export const CUEING_LEVEL_OPTIONS = [
  { value: "independent", label: "Independent" },
  { value: "minimal", label: "Minimal Cues" },
  { value: "moderate", label: "Moderate Cues" },
  { value: "maximum", label: "Maximum Cues" },
] as const

export const TELEHEALTH_PLATFORM_OPTIONS = [
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "webex", label: "Webex" },
] as const

export const CONNECTION_QUALITY_OPTIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
] as const
