"use client"

import * as React from "react"
import { getAllStaff } from "@/services/staffApi"
import { useQueryContext } from "@/providers/QueryProvider"
import type { StaffMember } from "@/types/staff"

interface UseStaffResult {
  data: StaffMember[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useStaff(): UseStaffResult {
  const { staffData, setStaffData, version } = useQueryContext()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isError, setIsError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [fetchCount, setFetchCount] = React.useState(0)

  const refetch = React.useCallback(() => {
    setFetchCount((c) => c + 1)
  }, [])

  React.useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setIsError(false)
    setError(null)

    getAllStaff()
      .then((data) => {
        if (!cancelled) {
          setStaffData(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setIsError(true)
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [version, fetchCount, setStaffData])

  return { data: staffData, isLoading, isError, error, refetch }
}
