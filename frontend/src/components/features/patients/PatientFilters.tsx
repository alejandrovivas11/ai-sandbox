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

interface PatientFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  providerFilter: string
  onProviderChange: (value: string) => void
}

const STATUS_OPTIONS = [
  "Active Treatment",
  "Discharged",
  "Waitlist",
  "Maintenance",
  "Follow-up",
]

const PROVIDER_OPTIONS = [
  "Dr. Sarah Johnson, CCC-SLP",
  "Dr. Michael Chen, CCC-SLP",
  "Lisa Rodriguez, CF-SLP",
  "Jennifer Kim, SLPA",
]

export function PatientFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
}: PatientFiltersProps) {
  return (
    <div className="flex flex-row items-center gap-3 px-6 pb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          placeholder="Search by name, DOB, MRN, or phone"
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
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={providerFilter || "__all__"}
        onValueChange={(v) => onProviderChange(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-[240px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="All Providers" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Providers</SelectItem>
          {PROVIDER_OPTIONS.map((provider) => (
            <SelectItem key={provider} value={provider}>
              {provider}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
