"use client"

import * as React from "react"
import type { StaffMember } from "@/types/staff"
import { getAllStaff } from "@/services/staffApi"
import { useQueryClient } from "@/providers/QueryProvider"

interface UseStaffParams {
  search?: string
  role?: string
  department?: string
}

interface UseStaffResult {
  data: StaffMember[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useStaff(params?: UseStaffParams): UseStaffResult {
  const { version } = useQueryClient()
  const [data, setData] = React.useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refetchCount, setRefetchCount] = React.useState(0)

  const refetch = React.useCallback(() => {
    setRefetchCount((c) => c + 1)
  }, [])

  React.useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getAllStaff({
      search: params?.search,
      role: params?.role,
      department: params?.department,
    })
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch staff")
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [params?.search, params?.role, params?.department, version, refetchCount])

  return { data, isLoading, error, refetch }
}
