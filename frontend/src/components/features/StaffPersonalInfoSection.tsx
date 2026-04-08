"use client"

import type { StaffMember } from "@/types/staff"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { H2 } from "@/components/ui/Typography"
import { Mail, Phone, MapPin, UserCheck } from "lucide-react"

interface StaffPersonalInfoSectionProps {
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

export function StaffPersonalInfoSection({ staff }: StaffPersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <H2>Personal Information</H2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={staff.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={staff.phone} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={staff.address} />
            <InfoRow icon={<UserCheck className="h-4 w-4" />} label="Emergency Contact" value={staff.emergency_contact} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
