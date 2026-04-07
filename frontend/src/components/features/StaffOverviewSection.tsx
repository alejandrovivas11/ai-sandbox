"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2, P, Small } from "@/components/ui/Typography"

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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-bold">{formatCurrency(staff.earnings ?? 0)}</P>
            <Small className="text-muted-foreground">Quarterly earnings</Small>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-bold">{staff.clients_count ?? 0}</P>
            <Small className="text-muted-foreground">Active clients</Small>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Utilized Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-bold">{staff.utilized_hours ?? 0}</P>
            <Small className="text-muted-foreground">Hours per quarter</Small>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cancelled Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-2xl font-bold">{staff.cancelled_hours ?? 0}</P>
            <Small className="text-muted-foreground">Hours per quarter</Small>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
