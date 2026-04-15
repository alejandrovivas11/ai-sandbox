'use client'

import { useState, useMemo } from 'react'
import { Target } from '@/types/targets'

interface TargetFilters {
  search: string
  status: string
  category: string
}

interface UseTargetFiltersReturn {
  filters: TargetFilters
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  setCategory: (value: string) => void
  filteredTargets: Target[]
}

export function useTargetFilters(targets: Target[]): UseTargetFiltersReturn {
  const [filters, setFilters] = useState<TargetFilters>({
    search: '',
    status: '',
    category: '',
  })

  const filteredTargets = useMemo(() => {
    let result = targets

    if (filters.search) {
      const lower = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(lower) ||
          t.author.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower)
      )
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status)
    }

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category)
    }

    return result
  }, [targets, filters])

  const setSearch = (value: string) =>
    setFilters((f) => ({ ...f, search: value }))
  const setStatus = (value: string) =>
    setFilters((f) => ({ ...f, status: value }))
  const setCategory = (value: string) =>
    setFilters((f) => ({ ...f, category: value }))

  return {
    filters,
    setSearch,
    setStatus,
    setCategory,
    filteredTargets,
  }
}
