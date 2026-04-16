"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"

interface ReferralFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  assignedFilter: string
  onAssignedChange: (value: string) => void
  triageFilter: string
  onTriageChange: (value: string) => void
  sourceFilter: string
  onSourceChange: (value: string) => void
}

export function ReferralFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  assignedFilter,
  onAssignedChange,
  triageFilter,
  onTriageChange,
  sourceFilter,
  onSourceChange,
}: ReferralFiltersProps) {
  return (
    <div className="flex flex-row items-center gap-3 px-6 pb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          placeholder="Search by patient name, referring physician, or referral ID"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter || "__all__"}
        onValueChange={(v) => onStatusChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Statuses</SelectItem>
          <SelectItem value="pending_review">Pending Review</SelectItem>
          <SelectItem value="documents_requested">Documents Requested</SelectItem>
          <SelectItem value="ready_for_triage">Ready for Triage</SelectItem>
          <SelectItem value="triaged">Triaged</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={assignedFilter || "__all__"}
        onValueChange={(v) => onAssignedChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[220px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Assigned CCC-SLP" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All CCC-SLPs</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          <SelectItem value="Sarah Johnson, CCC-SLP">Sarah Johnson, CCC-SLP</SelectItem>
          <SelectItem value="Michael Chen, CCC-SLP">Michael Chen, CCC-SLP</SelectItem>
          <SelectItem value="Lisa Rodriguez, CF-SLP">Lisa Rodriguez, CF-SLP</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={triageFilter || "__all__"}
        onValueChange={(v) => onTriageChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Triage Tier" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Tiers</SelectItem>
          <SelectItem value="urgent">Tier 1 - Urgent</SelectItem>
          <SelectItem value="priority">Tier 2 - Priority</SelectItem>
          <SelectItem value="routine">Tier 3 - Routine</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sourceFilter || "__all__"}
        onValueChange={(v) => onSourceChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Sources</SelectItem>
          <SelectItem value="fax_ocr">Fax/OCR</SelectItem>
          <SelectItem value="electronic">Electronic</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="walk_in">Walk-in</SelectItem>
          <SelectItem value="portal">Portal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
