'use client'

import { useState, useEffect, useMemo } from 'react'
import { Patient } from '@/types/patient'
import { getPatients } from '@/lib/api/patients'

interface UsePatientFilters {
  search: string
  status: string
  therapist: string
  insurance: string
}

interface UsePatientsReturn {
  patients: Patient[]
  filters: UsePatientFilters
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  setTherapist: (value: string) => void
  setInsurance: (value: string) => void
  clearFilters: () => void
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  toggleAll: () => void
  clearSelection: () => void
  isLoading: boolean
  totalCount: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

const INITIAL_FILTERS: UsePatientFilters = {
  search: '',
  status: '',
  therapist: '',
  insurance: '',
}

const PAGE_SIZE = 5

export function usePatients(): UsePatientsReturn {
  const [allPatients, setAllPatients] = useState<Patient[]>([])
  const [filters, setFilters] = useState<UsePatientFilters>(INITIAL_FILTERS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

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

  const filteredPatients = useMemo(() => {
    let result = allPatients

    if (filters.search) {
      const lower = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.mrn.toLowerCase().includes(lower) ||
          p.phone.includes(lower) ||
          p.dateOfBirth.includes(lower)
      )
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status)
    }

    if (filters.therapist) {
      result = result.filter((p) => p.assignedTherapist === filters.therapist)
    }

    if (filters.insurance) {
      result = result.filter((p) => p.insurance === filters.insurance)
    }

    return result
  }, [allPatients, filters])

  const patients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredPatients.slice(start, start + PAGE_SIZE)
  }, [filteredPatients, currentPage])

  const setSearch = (value: string) => setFilters((f) => ({ ...f, search: value }))
  const setStatus = (value: string) => setFilters((f) => ({ ...f, status: value }))
  const setTherapist = (value: string) => setFilters((f) => ({ ...f, therapist: value }))
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
    setTherapist,
    setInsurance,
    clearFilters,
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isLoading,
    totalCount: filteredPatients.length,
    currentPage,
    setCurrentPage,
  }
}
