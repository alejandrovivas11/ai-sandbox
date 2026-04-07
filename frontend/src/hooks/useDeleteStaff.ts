"use client"

import * as React from "react"
import { deleteStaff } from "@/services/staffApi"
import { useQueryClient } from "@/providers/QueryProvider"

interface UseDeleteStaffOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UseDeleteStaffResult {
  mutate: (id: string) => void
  isLoading: boolean
  error: string | null
}

export function useDeleteStaff(
  options?: UseDeleteStaffOptions
): UseDeleteStaffResult {
  const { invalidate } = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mutate = React.useCallback(
    (id: string) => {
      setIsLoading(true)
      setError(null)

      deleteStaff(id)
        .then(() => {
          invalidate()
          options?.onSuccess?.()
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Failed to delete staff"
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
