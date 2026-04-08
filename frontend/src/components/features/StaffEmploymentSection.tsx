"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2 } from "@/components/ui/Typography"
import { Hash, Building2, Briefcase, Calendar, MapPin } from "lucide-react"

interface StaffEmploymentSectionProps {
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

export function StaffEmploymentSection({ staff }: StaffEmploymentSectionProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    try {
      const date = new Date(dateString)
      const now = new Date()
      const years = now.getFullYear() - date.getFullYear()
      const months = now.getMonth() - date.getMonth()
      const totalMonths = years * 12 + months
      const y = Math.floor(totalMonths / 12)
      const m = totalMonths % 12
      const tenure = y > 0 ? `(${y}y ${m}m)` : `(${m}m)`
      return `${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ${tenure}`
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      <H2>Employment Details</H2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow icon={<Hash className="h-4 w-4" />} label="Employee ID" value={staff.employee_id} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Start Date" value={formatDate(staff.start_date || staff.startDate)} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department" value={staff.department} />
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Position" value={staff.position || staff.role} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Work Location" value={staff.work_location} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
