"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getStaffById } from "@/services/staffApi"
import type { StaffMember } from "@/types/staff"
import { Breadcrumbs } from "@/components/navigation"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { Spinner } from "@/components/ui/Spinner"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { AlertCircle, Mail, Pencil, Copy } from "lucide-react"
import { StaffOverviewSection } from "@/components/features/StaffOverviewSection"
import { StaffPersonalInfoSection } from "@/components/features/StaffPersonalInfoSection"
import { StaffEmploymentSection } from "@/components/features/StaffEmploymentSection"
import { StaffCompensationSection } from "@/components/features/StaffCompensationSection"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Active: "default",
  Onboarding: "secondary",
  Inactive: "outline",
}

export default function StaffProfilePage() {
  const params = useParams()
  const staffId = params.staffId as string
  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getStaffById(staffId)
        setStaff(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch staff member")
      } finally {
        setIsLoading(false)
      }
    }
    if (staffId) fetchStaff()
  }, [staffId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    )
  }

  if (error || !staff) {
    return (
      <div className="max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Staff member not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const initials = `${staff.firstName[0] ?? ""}${staff.lastName[0] ?? ""}`

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: "Staff", href: "/staff" },
        { label: `${staff.firstName} ${staff.lastName}` },
      ]} />

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="12">
                <AvatarFallback size="12" className="text-lg font-semibold bg-muted">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{staff.firstName} {staff.lastName}</h1>
                  <Badge variant={statusVariant[staff.status] ?? "outline"}>{staff.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {staff.role} &bull; {staff.department}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
            {staff.employee_id && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{staff.employee_id}</span>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Content Sections */}
      <StaffOverviewSection staff={staff} />
      <StaffPersonalInfoSection staff={staff} />
      <StaffEmploymentSection staff={staff} />
      <StaffCompensationSection staff={staff} />
    </div>
  )
}
