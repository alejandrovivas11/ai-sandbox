import { useState, useMemo } from "react"
import type { OnboardingPatient } from "@/types/patient-onboarding"

export function usePatientOnboarding(allPatients: OnboardingPatient[]) {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("")
  const [triageFilter, setTriageFilter] = useState("")
  const [slpFilter, setSlpFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")

  const patients = useMemo(() => {
    return allPatients.filter((p) => {
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.referralSource.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (stageFilter && p.onboardingStage !== stageFilter) return false
      if (triageFilter && p.triagePriority !== triageFilter) return false
      if (slpFilter && p.assignedSlp !== slpFilter) return false
      if (sourceFilter && p.referralSource !== sourceFilter) return false
      return true
    })
  }, [allPatients, search, stageFilter, triageFilter, slpFilter, sourceFilter])

  return {
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    triageFilter,
    setTriageFilter,
    slpFilter,
    setSlpFilter,
    sourceFilter,
    setSourceFilter,
    patients,
  }
}
