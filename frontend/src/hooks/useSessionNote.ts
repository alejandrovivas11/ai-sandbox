"use client"

import { useState, useCallback } from "react"
import type {
  SessionNoteFormData,
  GoalProgress,
  TelehealthFormData,
  SignatureFormData,
  SessionNoteData,
  GoalData,
  TelehealthInfo,
  SignatureInfo,
} from "@/types/session-note"
import { getDefaultSessionNoteForm, getDefaultSessionNote } from "@/lib/api/session-notes"

export function useSessionNoteForm() {
  const [formData, setFormData] = useState<SessionNoteFormData>(getDefaultSessionNoteForm)

  const updateField = useCallback(
    <K extends keyof SessionNoteFormData>(field: K, value: SessionNoteFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateGoalProgress = useCallback(
    (index: number, field: keyof GoalProgress, value: string) => {
      setFormData((prev) => {
        const goals = [...prev.goals]
        goals[index] = { ...goals[index], [field]: value }
        return { ...prev, goals }
      })
    },
    []
  )

  const updateTelehealth = useCallback(
    <K extends keyof TelehealthFormData>(field: K, value: TelehealthFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        telehealth: { ...prev.telehealth, [field]: value },
      }))
    },
    []
  )

  const updateSignature = useCallback(
    <K extends keyof SignatureFormData>(field: K, value: SignatureFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        signature: { ...prev.signature, [field]: value },
      }))
    },
    []
  )

  return {
    formData,
    updateField,
    updateGoalProgress,
    updateTelehealth,
    updateSignature,
  }
}

// Backward-compatible hook for old components
export function useSessionNote() {
  const [formData, setFormData] = useState<SessionNoteData>(getDefaultSessionNote)

  const updateField = useCallback(
    <K extends keyof SessionNoteData>(field: K, value: SessionNoteData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateGoal = useCallback(
    (index: number, field: keyof GoalData, value: string) => {
      setFormData((prev) => {
        const goals = [...prev.goals]
        goals[index] = { ...goals[index], [field]: value }
        return { ...prev, goals }
      })
    },
    []
  )

  const updateTelehealth = useCallback(
    <K extends keyof TelehealthInfo>(field: K, value: TelehealthInfo[K]) => {
      setFormData((prev) => ({
        ...prev,
        telehealth: { ...prev.telehealth, [field]: value },
      }))
    },
    []
  )

  const updateSignature = useCallback(
    <K extends keyof SignatureInfo>(field: K, value: SignatureInfo[K]) => {
      setFormData((prev) => ({
        ...prev,
        signature: { ...prev.signature, [field]: value },
      }))
    },
    []
  )

  return {
    formData,
    updateField,
    updateGoal,
    updateTelehealth,
    updateSignature,
  }
}
