import { useState, useCallback } from "react"
import type { IntakeFormData } from "@/types/intake"
import {
  PEDIATRIC_FORM_DATA,
  saveIntakeDraft,
  submitIntakeForm,
} from "@/lib/api/intake"

export function useIntakeForm() {
  const [formData, setFormData] = useState<IntakeFormData>(PEDIATRIC_FORM_DATA)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("pediatric")

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true)
    try {
      await saveIntakeDraft(formData)
    } finally {
      setIsSaving(false)
    }
  }, [formData])

  const handleSubmit = useCallback(async () => {
    setIsSaving(true)
    try {
      await submitIntakeForm(formData)
    } finally {
      setIsSaving(false)
    }
  }, [formData])

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    isSaving,
    handleSaveDraft,
    handleSubmit,
  }
}
