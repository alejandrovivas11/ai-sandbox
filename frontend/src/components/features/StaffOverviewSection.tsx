"use client"

import type { StaffMember } from "@/types/staff"
import { StatisticCard } from "@/components/blocks"
import { H2 } from "@/components/ui/Typography"

interface StaffOverviewSectionProps {
  staff: StaffMember
}

export function StaffOverviewSection({ staff }: StaffOverviewSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <H2>Overview</H2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatisticCard
          title="Earnings"
          value={formatCurrency(staff.earnings ?? 0)}
        />
        <StatisticCard
          title="Clients"
          value={staff.clients_count ?? 0}
        />
        <StatisticCard
          title="Utilized Hours"
          value={staff.utilized_hours ?? 0}
        />
        <StatisticCard
          title="Cancelled Hours"
          value={staff.cancelled_hours ?? 0}
        />
      </div>
    </div>
  )
}
