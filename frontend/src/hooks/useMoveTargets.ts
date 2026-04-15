"use client"

import { useState, useEffect, useCallback } from "react"
import { Target, Program, Client } from "@/types/move-targets"
import {
  getClient,
  getSourcePrograms,
  getDestinationPrograms,
  getTargets,
} from "@/lib/api/move-targets"

interface UseMoveTargetsReturn {
  client: Client | null
  sourcePrograms: Program[]
  destinationPrograms: Program[]
  targets: Target[]
  sourceValue: string
  setSourceValue: (value: string) => void
  destinationValue: string
  setDestinationValue: (value: string) => void
  selectedTargetIds: Set<string>
  toggleTarget: (id: string) => void
  isLoading: boolean
  canMove: boolean
}

export function useMoveTargets(): UseMoveTargetsReturn {
  const [client, setClient] = useState<Client | null>(null)
  const [sourcePrograms, setSourcePrograms] = useState<Program[]>([])
  const [destinationPrograms, setDestinationPrograms] = useState<Program[]>([])
  const [targets, setTargets] = useState<Target[]>([])
  const [sourceValue, setSourceValue] = useState("")
  const [destinationValue, setDestinationValue] = useState("")
  const [selectedTargetIds, setSelectedTargetIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    Promise.all([
      getClient(),
      getSourcePrograms(),
      getDestinationPrograms(),
      getTargets(),
    ]).then(([clientData, srcPrograms, destPrograms, targetsData]) => {
      if (!cancelled) {
        setClient(clientData)
        setSourcePrograms(srcPrograms)
        setDestinationPrograms(destPrograms)
        setTargets(targetsData)
        // Pre-select targets that have selected: true
        const preSelected = new Set(
          targetsData.filter((t) => t.selected).map((t) => t.id)
        )
        setSelectedTargetIds(preSelected)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const toggleTarget = useCallback((id: string) => {
    setSelectedTargetIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const canMove =
    selectedTargetIds.size > 0 &&
    destinationValue !== "" &&
    sourceValue !== destinationValue

  return {
    client,
    sourcePrograms,
    destinationPrograms,
    targets,
    sourceValue,
    setSourceValue,
    destinationValue,
    setDestinationValue,
    selectedTargetIds,
    toggleTarget,
    isLoading,
    canMove,
  }
}
