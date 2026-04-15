'use client'

import { useState, useCallback } from 'react'

interface UseTargetSelectionReturn {
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  toggleAll: (allIds: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  hasSelection: boolean
  selectedCount: number
}

export function useTargetSelection(): UseTargetSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleAll = useCallback((allIds: string[]) => {
    setSelectedIds((prev) => {
      if (prev.size === allIds.length) {
        return new Set()
      }
      return new Set(allIds)
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  )

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isSelected,
    hasSelection: selectedIds.size > 0,
    selectedCount: selectedIds.size,
  }
}
