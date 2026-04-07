"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2, P, Small } from "@/components/ui/Typography"

interface StaffCompensationSectionProps {
  staff: StaffMember
}

interface DescriptionItemProps {
  label: string
  value: string | undefined
}

function DescriptionItem({ label, value }: DescriptionItemProps) {
  return (
    <div className="py-3 border-b border-border last:border-b-0">
      <Small className="text-muted-foreground">{label}</Small>
      <P className="mt-1">{value || "Not provided"}</P>
    </div>
  )
}

export function StaffCompensationSection({ staff }: StaffCompensationSectionProps) {
  const formatPayRate = (payRate: number | undefined, payType: string | undefined) => {
    if (!payRate) return undefined
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(payRate)
    return payType === "Hourly" ? `${formatted}/hour` : formatted
  }

  return (
    <div className="space-y-4">
      <H2>Compensation & Benefits</H2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compensation Information</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <DescriptionItem label="Pay Type" value={staff.pay_type} />
          <DescriptionItem
            label="Pay Rate"
            value={formatPayRate(staff.pay_rate, staff.pay_type)}
          />
          <DescriptionItem label="Pay Frequency" value={staff.pay_frequency} />
          <DescriptionItem label="Benefits Enrolled" value={staff.benefits_enrolled} />
        </CardContent>
      </Card>
    </div>
  )
}
