'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select'
import {
  STATUS_OPTIONS,
  PROVIDER_OPTIONS,
  PAYER_OPTIONS,
  DIAGNOSIS_CATEGORY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from '@/lib/api/patients'

interface PatientFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  provider: string
  onProviderChange: (value: string) => void
  payer: string
  onPayerChange: (value: string) => void
  diagnosisCategory: string
  onDiagnosisCategoryChange: (value: string) => void
  serviceType: string
  onServiceTypeChange: (value: string) => void
}

export function PatientFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  provider,
  onProviderChange,
  payer,
  onPayerChange,
  diagnosisCategory,
  onDiagnosisCategoryChange,
  serviceType,
  onServiceTypeChange,
}: PatientFiltersProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      <div className="w-[300px]">
        <Input
          placeholder="Search by name, DOB, MRN, or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leadingIcon={<Search className="h-4 w-4" />}
        />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={provider} onValueChange={onProviderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Provider" />
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={payer} onValueChange={onPayerChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Payer" />
        </SelectTrigger>
        <SelectContent>
          {PAYER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={diagnosisCategory} onValueChange={onDiagnosisCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Diagnosis Category" />
        </SelectTrigger>
        <SelectContent>
          {DIAGNOSIS_CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={serviceType} onValueChange={onServiceTypeChange}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Service Type" />
        </SelectTrigger>
        <SelectContent>
          {SERVICE_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
