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
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onInsuranceChange: (value: string) => void
}

export function PatientFilters({
  onSearchChange,
  onStatusChange,
  onInsuranceChange,
}: PatientFiltersProps) {
  return (
    <div className="flex flex-row items-center gap-3 px-6">
      <div className="flex-1 relative">
        <Input
          placeholder="Search patients by name, DOB, MRN, or phone..."
          onChange={(e) => onSearchChange(e.target.value)}
          leadingIcon={<Search className="w-4 h-4 text-neutral-500" />}
        />
      </div>
      <Select
        onValueChange={(v) => onStatusChange(v === "__all__" ? "" : v)}
        defaultValue="__all__"
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(v) => onInsuranceChange(v === "__all__" ? "" : v)}
        defaultValue="__all__"
      >
        <SelectTrigger className="w-[200px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="All Insurance" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Insurance</SelectItem>
          <SelectItem value="Aetna">Aetna</SelectItem>
          <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
          <SelectItem value="Medicare">Medicare</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
