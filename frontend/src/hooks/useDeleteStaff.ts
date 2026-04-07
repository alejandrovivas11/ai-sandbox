"use client"

import * as React from "react"
import { deleteStaff } from "@/services/staffApi"
import { useQueryContext } from "@/providers/QueryProvider"

interface UseDeleteStaffResult {
  mutate: (id: string) => void
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

export function useDeleteStaff(
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseDeleteStaffResult {
  const { staffData, setStaffData, invalidate } = useQueryContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const mutate = React.useCallback(
    (id: string) => {
      setIsLoading(true)
      setIsError(false)
      setError(null)
      setIsSuccess(false)

      const previousData = [...staffData]
      setStaffData(staffData.filter((member) => member.id !== id))

      deleteStaff(id)
        .then(() => {
          setIsLoading(false)
          setIsSuccess(true)
          invalidate()
          onSuccess?.()
        })
        .catch((err) => {
          setStaffData(previousData)
          const e = err instanceof Error ? err : new Error(String(err))
          setIsError(true)
          setError(e)
          setIsLoading(false)
          onError?.(e)
        })
    },
    [staffData, setStaffData, invalidate, onSuccess, onError]
  )

  return { mutate, isLoading, isError, error, isSuccess }
}
