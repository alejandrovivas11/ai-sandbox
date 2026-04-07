"use client"

import * as React from "react"

interface QueryContextValue {
  /** Incremented on each invalidation to trigger re-fetches */
  version: number
  /** Call after any mutation to signal data staleness */
  invalidate: () => void
}

const QueryContext = React.createContext<QueryContextValue>({
  version: 0,
  invalidate: () => {},
})

export function useQueryClient() {
  return React.useContext(QueryContext)
}

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [version, setVersion] = React.useState(0)

  const invalidate = React.useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  const value = React.useMemo(
    () => ({ version, invalidate }),
    [version, invalidate]
  )

  return (
    <QueryContext.Provider value={value}>
      {children}
    </QueryContext.Provider>
  )
}
