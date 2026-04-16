import { z } from "zod"

export const demographicsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  caregiverName: z.string().min(1, "Caregiver name is required"),
  caregiverPhone: z.string().min(1, "Caregiver phone is required"),
  address: z.string().min(1, "Address is required"),
  referringPhysician: z.string().optional(),
})

export const insuranceSchema = z.object({
  primaryInsurance: z.string().min(1, "Primary insurance is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  groupNumber: z.string().optional(),
  authorizationStatus: z.string().optional(),
})

export const communicationSchema = z.object({
  primaryCommunicationConcern: z
    .string()
    .min(1, "Primary communication concern is required"),
  concernOnset: z.string().min(1, "Concern onset is required"),
  speechIntelligibility: z
    .string()
    .min(1, "Speech intelligibility rating is required"),
  languageConcerns: z.string().optional(),
})

export const swallowingSchema = z.object({
  swallowingDifficulties: z.string().optional(),
  currentDietTexture: z.string().optional(),
  liquidConsistency: z.string().optional(),
  aspirationHistory: z.boolean(),
})

export const voiceSchema = z.object({
  voiceQuality: z.string().optional(),
  voiceConcernOnset: z.string().optional(),
  vocalUseDemands: z.string().optional(),
  refluxHistory: z.boolean(),
})

export const milestonesSchema = z.object({
  ageFirstWords: z.string().optional(),
  ageFirstSentences: z.string().optional(),
  babblingHistory: z.string().optional(),
  feedingMilestones: z.string().optional(),
  motorMilestones: z.string().optional(),
  pediatricianConcerns: z.string().optional(),
})

export const hearingSchema = z.object({
  lastAudiologicalEvaluation: z.string().optional(),
  hearingStatus: z.string().min(1, "Hearing status is required"),
  hearingAidUse: z.string().optional(),
  tympanometryResults: z.string().optional(),
})

export const screeningSchema = z.object({
  eat10Score: z.string().optional(),
  vhi10Score: z.string().optional(),
  oasesScore: z.string().optional(),
})

export const medicalSchema = z.object({
  neurologicalHistory: z.string().optional(),
  headNeckSurgery: z.string().optional(),
  intubationHistory: z.string().optional(),
  tracheostomyStatus: z.string().optional(),
  currentMedications: z.string().optional(),
})

export const consentSchema = z.object({
  generalTreatmentConsent: z.literal(true, {
    message: "General treatment consent is required",
  }),
  telehealthConsent: z.boolean(),
  recordingConsent: z.boolean(),
  hipaaAcknowledgment: z.literal(true, {
    message: "HIPAA acknowledgment is required",
  }),
  instrumentalAssessmentConsent: z.boolean(),
})

export const intakeFormSchema = z.object({
  demographics: demographicsSchema,
  insurance: insuranceSchema,
  communication: communicationSchema,
  swallowing: swallowingSchema,
  voice: voiceSchema,
  milestones: milestonesSchema,
  hearing: hearingSchema,
  screening: screeningSchema,
  medical: medicalSchema,
  consent: consentSchema,
})
