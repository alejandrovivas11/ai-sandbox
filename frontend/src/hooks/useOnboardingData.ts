"use client";

import { useState, useMemo } from "react";
import type { OnboardingPatient, OnboardingKPI, OnboardingFilters } from "@/types/onboarding";
import { onboardingPatients, onboardingKPIs } from "@/lib/api/onboarding";

export function useOnboardingData() {
  const [filters, setFilters] = useState<OnboardingFilters>({
    search: "",
    onboardingStep: "",
    stepStatus: "",
    triagePriority: "",
    payer: "",
    assignedSLP: "",
    primaryConcern: "",
  });

  const kpis: OnboardingKPI[] = onboardingKPIs;
  const patients: OnboardingPatient[] = onboardingPatients;

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!patient.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.triagePriority && patient.triagePriority !== filters.triagePriority) {
        return false;
      }

      if (filters.payer && patient.insurancePayer !== filters.payer) {
        return false;
      }

      if (filters.assignedSLP && patient.assignedSLP !== filters.assignedSLP) {
        return false;
      }

      if (filters.primaryConcern && patient.primaryConcern !== filters.primaryConcern) {
        return false;
      }

      if (filters.stepStatus) {
        const stepValues = Object.values(patient.steps);
        if (!stepValues.includes(filters.stepStatus as OnboardingPatient["steps"]["referralValidation"])) {
          return false;
        }
      }

      if (filters.onboardingStep) {
        const stepMap: Record<string, keyof OnboardingPatient["steps"]> = {
          "Referral Validation": "referralValidation",
          "Case History Collection": "slpCaseHistory",
          "VOB (SLP Benefits)": "vobSlpBenefits",
          "PA (SLP Eval Codes)": "paSlpEvalCodes",
          "Scheduling": "schedulingStatus",
        };
        const stepKey = stepMap[filters.onboardingStep];
        if (stepKey) {
          const status = patient.steps[stepKey];
          if (status === "Complete" || status === "Ready to Schedule") {
            return false;
          }
        }
      }

      return true;
    });
  }, [patients, filters]);

  const updateFilter = (key: keyof OnboardingFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    kpis,
    patients: filteredPatients,
    filters,
    updateFilter,
  };
}
