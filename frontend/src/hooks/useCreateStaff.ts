"use client"

import * as React from "react"
import { createStaff } from "@/services/staffApi"
import { useQueryContext } from "@/providers/QueryProvider"
import type { CreateStaffRequest, StaffMember } from "@/types/staff"

interface UseCreateStaffResult {
  mutate: (data: CreateStaffRequest) => void
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

export function useCreateStaff(
  onSuccess?: (member: StaffMember) => void,
  onError?: (error: Error) => void
): UseCreateStaffResult {
  const { staffData, setStaffData, invalidate } = useQueryContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const mutate = React.useCallback(
    (data: CreateStaffRequest) => {
      setIsLoading(true)
      setIsError(false)
      setError(null)
      setIsSuccess(false)

      const optimisticId = `temp-${Date.now()}`
      const optimisticMember: StaffMember = {
        ...data,
        id: optimisticId,
      }
      const previousData = [...staffData]
      setStaffData([...staffData, optimisticMember])

      createStaff(data)
        .then((created) => {
          setIsLoading(false)
          setIsSuccess(true)
          invalidate()
          onSuccess?.(created)
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
