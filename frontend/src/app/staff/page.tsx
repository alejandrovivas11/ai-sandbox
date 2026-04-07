"use client"

import * as React from "react"
import { H2, Muted } from "@/components/ui/Typography"
import { Input } from "@/components/ui/Input"
import { StaffTable } from "@/components/features/StaffTable"
import { Search } from "lucide-react"

export default function StaffPage() {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H2>Staff Management</H2>
          <Muted>Manage your healthcare team members, roles, and statuses.</Muted>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <StaffTable searchQuery={debouncedSearch} />
    </div>
  )
}
