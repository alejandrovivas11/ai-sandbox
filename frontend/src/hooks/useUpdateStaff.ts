"use client"

import * as React from "react"
import type { StaffMember, UpdateStaffRequest } from "@/types/staff"
import { updateStaff } from "@/services/staffApi"
import { useQueryClient } from "@/providers/QueryProvider"

interface UseUpdateStaffOptions {
  onSuccess?: (data: StaffMember) => void
  onError?: (error: string) => void
}

interface UseUpdateStaffResult {
  mutate: (id: string, request: UpdateStaffRequest) => void
  isLoading: boolean
  error: string | null
}

export function useUpdateStaff(
  options?: UseUpdateStaffOptions
): UseUpdateStaffResult {
  const { invalidate } = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    (id: string, request: UpdateStaffRequest) => {
      setIsLoading(true)
      setError(null)

      updateStaff(id, request)
        .then((result) => {
          invalidate()
          options?.onSuccess?.(result)
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Failed to update staff"
          setError(message)
          options?.onError?.(message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [invalidate, options]
  )

  return { mutate, isLoading, error }
}
