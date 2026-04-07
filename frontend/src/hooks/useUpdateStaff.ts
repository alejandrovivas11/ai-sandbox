"use client"

import * as React from "react"
import { updateStaff } from "@/services/staffApi"
import { useQueryContext } from "@/providers/QueryProvider"
import type { CreateStaffRequest, StaffMember } from "@/types/staff"

interface UseUpdateStaffResult {
  mutate: (id: string, data: Partial<CreateStaffRequest>) => void
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

export function useUpdateStaff(
  onSuccess?: (member: StaffMember) => void,
  onError?: (error: Error) => void
): UseUpdateStaffResult {
  const { staffData, setStaffData, invalidate } = useQueryContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const mutate = React.useCallback(
    (id: string, data: Partial<CreateStaffRequest>) => {
      setIsLoading(true)
      setIsError(false)
      setError(null)
      setIsSuccess(false)

      const previousData = [...staffData]
      setStaffData(
        staffData.map((member) =>
          member.id === id ? { ...member, ...data } : member
        )
      )

      updateStaff(id, data)
        .then((updated) => {
          setIsLoading(false)
          setIsSuccess(true)
          invalidate()
          onSuccess?.(updated)
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
