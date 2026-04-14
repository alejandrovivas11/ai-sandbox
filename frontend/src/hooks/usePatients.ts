'use client'

import { useState, useMemo } from 'react'
import type { Patient } from '@/types/patient'
import { getPatientsMock, TOTAL_PATIENTS } from '@/lib/api/patients'

interface UsePatientFilters {
  search: string
  status: string
  provider: string
  payer: string
  diagnosisCategory: string
  serviceType: string
}

interface UsePatientsReturn {
  patients: Patient[]
  totalPatients: number
  filters: UsePatientFilters
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  setProvider: (value: string) => void
  setPayer: (value: string) => void
  setDiagnosisCategory: (value: string) => void
  setServiceType: (value: string) => void
  page: number
  setPage: (page: number) => void
  pageSize: string
  setPageSize: (size: string) => void
}

export function usePatients(): UsePatientsReturn {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [provider, setProvider] = useState('all')
  const [payer, setPayer] = useState('all')
  const [diagnosisCategory, setDiagnosisCategory] = useState('all')
  const [serviceType, setServiceType] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('25')

  const allPatients = useMemo(() => getPatientsMock(), [])

  const patients = useMemo(() => {
    return allPatients.filter((patient) => {
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          patient.name.toLowerCase().includes(q) ||
          patient.patientId.toLowerCase().includes(q) ||
          patient.dateOfBirth.includes(q)
        if (!matchesSearch) return false
      }
      if (status !== 'all' && patient.status.toLowerCase().replace(/\s+/g, '_') !== status) return false
      if (provider !== 'all' && patient.provider !== provider) return false
      if (payer !== 'all' && patient.payer !== payer) return false
      if (diagnosisCategory !== 'all' && patient.diagnosisCategory !== diagnosisCategory) return false
      if (serviceType !== 'all' && patient.serviceType !== serviceType) return false
      return true
    })
  }, [allPatients, search, status, provider, payer, diagnosisCategory, serviceType])

  return {
    patients,
    totalPatients: TOTAL_PATIENTS,
    filters: { search, status, provider, payer, diagnosisCategory, serviceType },
    setSearch,
    setStatus,
    setProvider,
    setPayer,
    setDiagnosisCategory,
    setServiceType,
    page,
    setPage,
    pageSize,
    setPageSize,
  }
}
