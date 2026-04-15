'use client'

import { useState, useEffect, useMemo } from 'react'
import { Patient, PatientStatus } from '@/types/patient'
import { getPatients } from '@/lib/api/patients'

interface UsePatientFilters {
  search: string
  status: string
  provider: string
  insurance: string
}

interface UsePatientsReturn {
  patients: Patient[]
  filters: UsePatientFilters
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  setProvider: (value: string) => void
  setInsurance: (value: string) => void
  clearFilters: () => void
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  toggleAll: () => void
  clearSelection: () => void
  isLoading: boolean
}

const INITIAL_FILTERS: UsePatientFilters = {
  search: '',
  status: '',
  provider: '',
  insurance: '',
}

export function usePatients(): UsePatientsReturn {
  const [allPatients, setAllPatients] = useState<Patient[]>([])
  const [filters, setFilters] = useState<UsePatientFilters>(INITIAL_FILTERS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getPatients().then((data) => {
      if (!cancelled) {
        setAllPatients(data)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const patients = useMemo(() => {
    let result = allPatients

    if (filters.search) {
      const lower = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.mrn.toLowerCase().includes(lower) ||
          p.email.toLowerCase().includes(lower) ||
          p.dateOfBirth.includes(lower)
      )
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status)
    }

    if (filters.provider) {
      result = result.filter(
        (p) => p.primaryProvider.toLowerCase().replace(/\s+/g, '_').replace('dr._', 'dr_') === filters.provider
      )
    }

    if (filters.insurance) {
      const insuranceMap: Record<string, string> = {
        bcbs: 'Blue Cross Blue Shield',
        aetna: 'Aetna',
        medicare: 'Medicare',
        medicaid: 'Medicaid',
      }
      result = result.filter((p) => p.insurance === insuranceMap[filters.insurance])
    }

    return result
  }, [allPatients, filters])

  const setSearch = (value: string) => setFilters((f) => ({ ...f, search: value }))
  const setStatus = (value: string) => setFilters((f) => ({ ...f, status: value }))
  const setProvider = (value: string) => setFilters((f) => ({ ...f, provider: value }))
  const setInsurance = (value: string) => setFilters((f) => ({ ...f, insurance: value }))
  const clearFilters = () => setFilters(INITIAL_FILTERS)

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === patients.length) {
        return new Set()
      }
      return new Set(patients.map((p) => p.id))
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  return {
    patients,
    filters,
    setSearch,
    setStatus,
    setProvider,
    setInsurance,
    clearFilters,
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isLoading,
  }
}
