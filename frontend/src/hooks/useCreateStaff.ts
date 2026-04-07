"use client"

import * as React from "react"
import type { StaffMember, CreateStaffRequest } from "@/types/staff"
import { createStaff } from "@/services/staffApi"
import { useQueryClient } from "@/providers/QueryProvider"

interface UseCreateStaffOptions {
  onSuccess?: (data: StaffMember) => void
  onError?: (error: string) => void
}

interface UseCreateStaffResult {
  mutate: (request: CreateStaffRequest) => void
  isLoading: boolean
  error: string | null
}

export function useCreateStaff(
  options?: UseCreateStaffOptions
): UseCreateStaffResult {
  const { invalidate } = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    (request: CreateStaffRequest) => {
      setIsLoading(true)
      setError(null)

      createStaff(request)
        .then((result) => {
          invalidate()
          options?.onSuccess?.(result)
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Failed to create staff"
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
