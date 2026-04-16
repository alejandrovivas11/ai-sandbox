"use client"

import { useState, useMemo } from "react"
import type { Patient } from "@/types/patient"
import { filterPatients } from "@/lib/api/patients"

const ITEMS_PER_PAGE = 5

export function usePatients(patients: Patient[]) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [providerFilter, setProviderFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(
    () => filterPatients(patients, search, statusFilter, providerFilter),
    [patients, search, statusFilter, providerFilter]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    providerFilter,
    setProviderFilter,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    totalResults: filtered.length,
    patients: paginated,
    startIndex,
  }
}
