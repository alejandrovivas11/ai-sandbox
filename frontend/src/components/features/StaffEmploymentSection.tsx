"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2, P, Small } from "@/components/ui/Typography"

interface StaffEmploymentSectionProps {
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

export function StaffEmploymentSection({ staff }: StaffEmploymentSectionProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
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
        <CardContent className="px-0">
          <DescriptionItem label="Employee ID" value={staff.employee_id} />
          <DescriptionItem label="Department" value={staff.department} />
          <DescriptionItem label="Position" value={staff.position} />
          <DescriptionItem label="Start Date" value={formatDate(staff.start_date)} />
          <DescriptionItem label="Work Location" value={staff.work_location} />
        </CardContent>
      </Card>
    </div>
  )
}
