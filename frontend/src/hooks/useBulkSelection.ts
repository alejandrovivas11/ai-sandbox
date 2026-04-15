'use client'

import { useState, useEffect, useMemo } from 'react'
import { Target } from '@/types/targets'
import { getTargets } from '@/lib/api/targets'
import { useTargetFilters } from '@/hooks/useTargetFilters'

const PAGE_SIZE = 5

export function useBulkSelection() {
  const [allTargets, setAllTargets] = useState<Target[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    filters,
    setSearch,
    setStatus,
    setCategory,
    filteredTargets,
  } = useTargetFilters(allTargets)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getTargets().then((data) => {
      if (!cancelled) {
        setAllTargets(data)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const targets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredTargets.slice(start, start + PAGE_SIZE)
  }, [filteredTargets, currentPage])

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
      if (prev.size === targets.length && targets.every((t) => prev.has(t.id))) {
        return new Set()
      }
      return new Set(targets.map((t) => t.id))
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  return {
    targets,
    filters,
    setSearch,
    setStatus,
    setCategory,
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isLoading,
    totalCount: filteredTargets.length,
    currentPage,
    setCurrentPage,
  }
}
