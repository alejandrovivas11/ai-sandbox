"use client"

import { useState, useCallback } from "react"
import type { SessionNoteData, ObjectiveGoal, TelehealthData } from "@/types/session-note"
import { getDefaultSessionNote } from "@/lib/api/session-notes"

export function useSessionNote() {
  const [formData, setFormData] = useState<SessionNoteData>(getDefaultSessionNote)

  const updateField = useCallback(
    <K extends keyof SessionNoteData>(field: K, value: SessionNoteData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateGoal = useCallback(
    (index: number, field: keyof ObjectiveGoal, value: string) => {
      setFormData((prev) => {
        const goals = [...prev.objectiveGoals]
        goals[index] = { ...goals[index], [field]: value }
        return { ...prev, objectiveGoals: goals }
      })
    },
    []
  )

  const updateTelehealth = useCallback(
    <K extends keyof TelehealthData>(field: K, value: TelehealthData[K]) => {
      setFormData((prev) => ({
        ...prev,
        telehealth: {
          platform: "",
          connectionQuality: "",
          patientLocation: "",
          providerLocation: "",
          clinicalObservations: "",
          consentConfirmed: false,
          ...prev.telehealth,
          [field]: value,
        },
      }))
    },
    []
  )

  const isTelehealth = formData.serviceDeliveryMode === "telehealth"

  return {
    formData,
    updateField,
    updateGoal,
    updateTelehealth,
    isTelehealth,
  }
}
