"use client"

import * as React from "react"
import type { StaffMember } from "@/types/staff"

interface QueryState {
  staffData: StaffMember[]
  setStaffData: (data: StaffMember[]) => void
  invalidate: () => void
  version: number
}

const QueryContext = React.createContext<QueryState | null>(null)

export function useQueryContext() {
  const context = React.useContext(QueryContext)
  if (!context) {
    throw new Error("useQueryContext must be used within a QueryProvider")
  }
  return context
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [staffData, setStaffData] = React.useState<StaffMember[]>([])
  const [version, setVersion] = React.useState(0)

  const invalidate = React.useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  const value = React.useMemo(
    () => ({ staffData, setStaffData, invalidate, version }),
    [staffData, setStaffData, invalidate, version]
  )

  return (
    <QueryContext.Provider value={value}>
      {children}
    </QueryContext.Provider>
  )
}
