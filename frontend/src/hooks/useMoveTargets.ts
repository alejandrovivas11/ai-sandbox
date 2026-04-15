'use client'

import { useState, useEffect } from 'react'
import { Target, Patient, Program } from '@/types/targets'
import { getTargets, getDestinationPrograms } from '@/lib/api/targets'
import { getPatientForMoveTargets } from '@/lib/api/move-targets-patients'

interface UseMoveTargetsReturn {
  targets: Target[]
  patient: Patient | null
  programs: Program[]
  destinationValue: string
  setDestinationValue: (value: string) => void
  isLoading: boolean
}

export function useMoveTargets(): UseMoveTargetsReturn {
  const [targets, setTargets] = useState<Target[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [destinationValue, setDestinationValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    Promise.all([getTargets(), getPatientForMoveTargets(), getDestinationPrograms()]).then(
      ([targetsData, patientData, programsData]) => {
        if (!cancelled) {
          setTargets(targetsData)
          setPatient(patientData)
          setPrograms(programsData)
          setIsLoading(false)
        }
      }
    )

    return () => {
      cancelled = true
    }
  }, [])

  return {
    targets,
    patient,
    programs,
    destinationValue,
    setDestinationValue,
    isLoading,
  }
}
