"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2 } from "@/components/ui/Typography"
import { DescriptionItem } from "@/components/blocks"

interface StaffPersonalInfoSectionProps {
  staff: StaffMember
}

export function StaffPersonalInfoSection({ staff }: StaffPersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <H2>Personal Information</H2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <DescriptionItem label="Email" value={staff.email} />
          <DescriptionItem label="Phone" value={staff.phone} />
          <DescriptionItem label="Address" value={staff.address} />
          <DescriptionItem label="Emergency Contact" value={staff.emergency_contact} />
        </CardContent>
      </Card>
    </div>
  )
}
