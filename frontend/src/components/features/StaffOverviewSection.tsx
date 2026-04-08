"use client"

import type { StaffMember } from "@/types/staff"
import { StatisticCard } from "@/components/blocks"
import { H2 } from "@/components/ui/Typography"
import { DollarSign, Users, Clock, XCircle } from "lucide-react"

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          header="Earnings"
          value={formatCurrency(staff.earnings ?? 0)}
          showInfo
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatisticCard
          header="Clients"
          value={String(staff.clients_count ?? 0)}
          showInfo
          icon={<Users className="h-4 w-4" />}
        />
        <StatisticCard
          header="Utilized Hours"
          value={`${staff.utilized_hours ?? 0} hrs`}
          showInfo
          icon={<Clock className="h-4 w-4" />}
        />
        <StatisticCard
          header="Cancelled Hours"
          value={`${staff.cancelled_hours ?? 0} hrs`}
          icon={<XCircle className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}
