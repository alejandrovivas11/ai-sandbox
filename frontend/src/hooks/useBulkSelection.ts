'use client'

import { useState, useEffect, useMemo } from 'react'
import { BulkRecord, BulkSelectionFilters } from '@/types/bulk-selection'
import { getBulkRecords } from '@/lib/api/bulk-selection'

interface UseBulkSelectionReturn {
  records: BulkRecord[]
  filters: BulkSelectionFilters
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  toggleAll: () => void
  clearSelection: () => void
  isLoading: boolean
  totalCount: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

const PAGE_SIZE = 5

export function useBulkSelection(): UseBulkSelectionReturn {
  const [allRecords, setAllRecords] = useState<BulkRecord[]>([])
  const [filters, setFilters] = useState<BulkSelectionFilters>({
    search: '',
    status: '',
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getBulkRecords().then((data) => {
      if (!cancelled) {
        setAllRecords(data)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRecords = useMemo(() => {
    let result = allRecords

    if (filters.search) {
      const lower = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.assignee.toLowerCase().includes(lower) ||
          r.type.toLowerCase().includes(lower)
      )
    }

    if (filters.status) {
      result = result.filter((r) => r.status === filters.status)
    }

    return result
  }, [allRecords, filters])

  const records = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRecords.slice(start, start + PAGE_SIZE)
  }, [filteredRecords, currentPage])

  const setSearch = (value: string) =>
    setFilters((f) => ({ ...f, search: value }))
  const setStatus = (value: string) =>
    setFilters((f) => ({ ...f, status: value }))

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
      if (prev.size === records.length) {
        return new Set()
      }
      return new Set(records.map((r) => r.id))
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  return {
    records,
    filters,
    setSearch,
    setStatus,
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isLoading,
    totalCount: filteredRecords.length,
    currentPage,
    setCurrentPage,
  }
}
