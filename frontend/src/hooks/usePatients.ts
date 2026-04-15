"use client"

import { useState, useMemo } from "react"
import type { Patient } from "@/types/patient"
import { getPatientsMock } from "@/lib/api/patients"

interface UsePatientFilters {
  search: string
  status: string
  insurance: string
}

export function usePatients() {
  const allPatients = getPatientsMock()
  const [filters, setFilters] = useState<UsePatientFilters>({
    search: "",
    status: "",
    insurance: "",
  })
  const [sortField, setSortField] = useState<keyof Patient | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filtered = useMemo(() => {
    let result = allPatients

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.dateOfBirth.includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q)
      )
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status)
    }

    if (filters.insurance) {
      result = result.filter((p) => p.insurance === filters.insurance)
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDirection === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [allPatients, filters, sortField, sortDirection])

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }))
  }

  function setStatus(status: string) {
    setFilters((prev) => ({ ...prev, status }))
  }

  function setInsurance(insurance: string) {
    setFilters((prev) => ({ ...prev, insurance }))
  }

  function toggleSort(field: keyof Patient) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return {
    patients: filtered,
    totalCount: 247,
    filters,
    setSearch,
    setStatus,
    setInsurance,
    sortField,
    sortDirection,
    toggleSort,
  }
}
