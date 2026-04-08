"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2 } from "@/components/ui/Typography"
import { Badge } from "@/components/ui/Badge"
import { Banknote, CalendarClock, Shield } from "lucide-react"

interface StaffCompensationSectionProps {
  staff: StaffMember
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
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

  const benefits = staff.benefits_enrolled
    ? staff.benefits_enrolled.split(",").map((b) => b.trim()).filter(Boolean)
    : []

  return (
    <div className="space-y-4">
      <H2>Compensation & Benefits</H2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compensation Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow icon={<Banknote className="h-4 w-4" />} label="Pay Type" value={staff.pay_type} />
            <InfoRow
              icon={<Banknote className="h-4 w-4" />}
              label="Pay Rate"
              value={formatPayRate(staff.pay_rate, staff.pay_type)}
            />
            <InfoRow icon={<CalendarClock className="h-4 w-4" />} label="Pay Frequency" value={staff.pay_frequency} />
          </div>

          {benefits.length > 0 && (
            <div className="flex items-start gap-3 mt-6">
              <span className="text-muted-foreground mt-0.5 shrink-0"><Shield className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Benefits Enrolled</p>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary">{benefit}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          {benefits.length === 0 && (
            <div className="flex items-start gap-3 mt-6">
              <span className="text-muted-foreground mt-0.5 shrink-0"><Shield className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground">Benefits Enrolled</p>
                <p className="text-sm font-medium">—</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
