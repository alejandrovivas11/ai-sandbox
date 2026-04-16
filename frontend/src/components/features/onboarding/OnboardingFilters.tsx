"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { OnboardingFilters as FilterState } from "@/types/onboarding";

interface OnboardingFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

export function OnboardingFilters({ filters, onFilterChange }: OnboardingFiltersProps) {
  const handleSelectChange = (key: keyof FilterState) => (value: string) => {
    onFilterChange(key, value === "__all__" ? "" : value);
  };

  return (
    <div className="flex flex-row items-center gap-3 flex-wrap">
      <div className="w-[300px]">
        <Input
          placeholder="Search patients..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          leadingIcon={<Search className="w-4 h-4 text-neutral-500" />}
        />
      </div>

      <Select
        value={filters.onboardingStep || "__all__"}
        onValueChange={handleSelectChange("onboardingStep")}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Onboarding Step" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Steps</SelectItem>
          <SelectItem value="Referral Validation">Referral Validation</SelectItem>
          <SelectItem value="Case History Collection">Case History Collection</SelectItem>
          <SelectItem value="VOB (SLP Benefits)">VOB (SLP Benefits)</SelectItem>
          <SelectItem value="PA (SLP Eval Codes)">PA (SLP Eval Codes)</SelectItem>
          <SelectItem value="Scheduling">Scheduling</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.stepStatus || "__all__"}
        onValueChange={handleSelectChange("stepStatus")}
      >
        <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Step Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Statuses</SelectItem>
          <SelectItem value="Not Started">Not Started</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Complete">Complete</SelectItem>
          <SelectItem value="Issue">Issue</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.triagePriority || "__all__"}
        onValueChange={handleSelectChange("triagePriority")}
      >
        <SelectTrigger className="w-[160px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Triage Priority" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Priorities</SelectItem>
          <SelectItem value="Tier 1 Urgent">Tier 1 Urgent</SelectItem>
          <SelectItem value="Tier 2 Priority">Tier 2 Priority</SelectItem>
          <SelectItem value="Tier 3 Routine">Tier 3 Routine</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.payer || "__all__"}
        onValueChange={handleSelectChange("payer")}
      >
        <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Payer" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Payers</SelectItem>
          <SelectItem value="Medicare">Medicare</SelectItem>
          <SelectItem value="Medicaid">Medicaid</SelectItem>
          <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
          <SelectItem value="Aetna">Aetna</SelectItem>
          <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
          <SelectItem value="Cigna">Cigna</SelectItem>
          <SelectItem value="Tricare">Tricare</SelectItem>
          <SelectItem value="Self-Pay">Self-Pay</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assignedSLP || "__all__"}
        onValueChange={handleSelectChange("assignedSLP")}
      >
        <SelectTrigger className="w-[220px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Assigned SLP" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All SLPs</SelectItem>
          <SelectItem value="Dr. Sarah Mitchell, CCC-SLP">Dr. Sarah Mitchell, CCC-SLP</SelectItem>
          <SelectItem value="James Rivera, CCC-SLP">James Rivera, CCC-SLP</SelectItem>
          <SelectItem value="Emily Chen, CCC-SLP">Emily Chen, CCC-SLP</SelectItem>
          <SelectItem value="Michael Torres, CF-SLP">Michael Torres, CF-SLP</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.primaryConcern || "__all__"}
        onValueChange={handleSelectChange("primaryConcern")}
      >
        <SelectTrigger className="w-[200px] bg-white border border-[#E5E5E5]">
          <SelectValue placeholder="Primary Concern" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="__all__">All Categories</SelectItem>
          <SelectItem value="Articulation/Phonology">Articulation/Phonology</SelectItem>
          <SelectItem value="Expressive Language">Expressive Language</SelectItem>
          <SelectItem value="Receptive Language">Receptive Language</SelectItem>
          <SelectItem value="Fluency/Stuttering">Fluency/Stuttering</SelectItem>
          <SelectItem value="Voice">Voice</SelectItem>
          <SelectItem value="Dysphagia/Feeding">Dysphagia/Feeding</SelectItem>
          <SelectItem value="Cognitive-Communication">Cognitive-Communication</SelectItem>
          <SelectItem value="AAC">AAC</SelectItem>
          <SelectItem value="Apraxia of Speech">Apraxia of Speech</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1" />

      <Button variant="default">+ New Patient</Button>
    </div>
  );
}
