"use client"

import { useState, useEffect } from "react"
import type { PatientChartData } from "@/types/patient-detail"
import { getPatientChart } from "@/lib/api/patient-detail"

export function usePatientChart(patientId: string) {
  const [data, setData] = useState<PatientChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPatientChart(patientId)
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load patient data")
        setLoading(false)
      })
  }, [patientId])

  return { data, loading, error }
}
