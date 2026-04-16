import { useState, useMemo } from "react"
import type { Referral, ReferralStatus, TriageTier, ReferralSource } from "@/types/referral"

export function useReferrals(allReferrals: Referral[]) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [assignedFilter, setAssignedFilter] = useState("")
  const [triageFilter, setTriageFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const referrals = useMemo(() => {
    return allReferrals.filter((r) => {
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          r.patient_name.toLowerCase().includes(q) ||
          r.referring_physician.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (statusFilter && r.status !== statusFilter) return false
      if (assignedFilter) {
        if (assignedFilter === "unassigned" && r.assigned_slp !== null) return false
        if (assignedFilter !== "unassigned" && r.assigned_slp !== assignedFilter) return false
      }
      if (triageFilter && r.triage_tier !== triageFilter) return false
      if (sourceFilter && r.referral_source !== sourceFilter) return false
      return true
    })
  }, [allReferrals, search, statusFilter, assignedFilter, triageFilter, sourceFilter])

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === referrals.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(referrals.map((r) => r.id)))
    }
  }

  const allSelected = referrals.length > 0 && selectedIds.size === referrals.length

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    assignedFilter,
    setAssignedFilter,
    triageFilter,
    setTriageFilter,
    sourceFilter,
    setSourceFilter,
    referrals,
    selectedIds,
    toggleSelection,
    toggleAll,
    allSelected,
  }
}
