export type TriagePriority = "Tier 1 Urgent" | "Tier 2 Priority" | "Tier 3 Routine";

export type OnboardingStepStatus =
  | "Complete"
  | "In Progress"
  | "Pending"
  | "Not Started"
  | "Issue"
  | "Ready to Schedule";

export interface OnboardingSteps {
  referralValidation: OnboardingStepStatus;
  slpCaseHistory: OnboardingStepStatus;
  vobSlpBenefits: OnboardingStepStatus;
  paSlpEvalCodes: OnboardingStepStatus;
  schedulingStatus: OnboardingStepStatus;
}

export interface OnboardingPatient {
  id: string;
  name: string;
  triagePriority: TriagePriority;
  primaryConcern: string;
  referralDate: string;
  dateOfBirth: string;
  caregiverGuardian: string;
  insurancePayer: string;
  referralSource: string;
  steps: OnboardingSteps;
  assignedSLP: string;
  daysInOnboarding: number;
}

export interface OnboardingKPI {
  label: string;
  value: string;
  color: "warning" | "primary" | "accent" | "secondary" | "success";
  delta: string;
}

export interface OnboardingFilters {
  search: string;
  onboardingStep: string;
  stepStatus: string;
  triagePriority: string;
  payer: string;
  assignedSLP: string;
  primaryConcern: string;
}
