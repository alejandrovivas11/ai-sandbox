"use client"

import { Input } from "@/components/ui/Input"
import { Search } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"

interface PatientOnboardingFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  stageFilter: string
  onStageChange: (value: string) => void
  triageFilter: string
  onTriageChange: (value: string) => void
  slpFilter: string
  onSlpChange: (value: string) => void
  sourceFilter: string
  onSourceChange: (value: string) => void
}

export function PatientOnboardingFilters({
  search,
  onSearchChange,
  stageFilter,
  onStageChange,
  triageFilter,
  onTriageChange,
  slpFilter,
  onSlpChange,
  sourceFilter,
  onSourceChange,
}: PatientOnboardingFiltersProps) {
  return (
    <div className="flex flex-row items-center gap-3 px-6 pb-4">
      <div className="w-[300px]">
        <Input
          placeholder="Search by patient name, referral source..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leadingIcon={<Search className="w-4 h-4 text-gray-400" />}
        />
      </div>
      <div className="flex-1" />
      <Select
        value={stageFilter || "__all__"}
        onValueChange={(v) => onStageChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Onboarding Stage" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Stages</SelectItem>
          <SelectItem value="Referral Received">Referral Received</SelectItem>
          <SelectItem value="Case History Collection">Case History Collection</SelectItem>
          <SelectItem value="VOB in Progress">VOB in Progress</SelectItem>
          <SelectItem value="PA Requested">PA Requested</SelectItem>
          <SelectItem value="Eval Scheduled">Eval Scheduled</SelectItem>
          <SelectItem value="Onboarding Complete">Onboarding Complete</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={triageFilter || "__all__"}
        onValueChange={(v) => onTriageChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Triage Priority" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Tiers</SelectItem>
          <SelectItem value="Tier 1 Urgent">Tier 1 Urgent</SelectItem>
          <SelectItem value="Tier 2 Priority">Tier 2 Priority</SelectItem>
          <SelectItem value="Tier 3 Routine">Tier 3 Routine</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={slpFilter || "__all__"}
        onValueChange={(v) => onSlpChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Assigned SLP" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Providers</SelectItem>
          <SelectItem value="Dr. Maria Chen">Dr. Maria Chen</SelectItem>
          <SelectItem value="Sarah Thompson">Sarah Thompson</SelectItem>
          <SelectItem value="James Rodriguez">James Rodriguez</SelectItem>
          <SelectItem value="Emily Park">Emily Park</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sourceFilter || "__all__"}
        onValueChange={(v) => onSourceChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Referral Source" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Sources</SelectItem>
          <SelectItem value="Physician">Physician</SelectItem>
          <SelectItem value="School">School</SelectItem>
          <SelectItem value="Self-referral">Self-referral</SelectItem>
          <SelectItem value="Hospital">Hospital</SelectItem>
          <SelectItem value="Other Provider">Other Provider</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
