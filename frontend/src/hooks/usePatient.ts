"use client"

import { useEffect, useState } from "react"
import type { PatientChartData } from "@/types/patient-chart"
import { getPatientChart } from "@/lib/api/patient-chart"

export function usePatient(patientId: string) {
  const [data, setData] = useState<PatientChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getPatientChart(patientId)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [patientId])

  return { data, isLoading, error }
}
