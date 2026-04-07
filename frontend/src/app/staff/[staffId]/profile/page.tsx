"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getStaffById } from "@/services/staffApi"
import type { StaffMember } from "@/types/staff"
import { SidebarProvider, SidebarInset } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/Navigation/Sidebar"
import { H1, Muted } from "@/components/ui/Typography"
import { Spinner } from "@/components/ui/Spinner"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { AlertCircle } from "lucide-react"
import { StaffOverviewSection } from "@/components/features/StaffOverviewSection"
import { StaffPersonalInfoSection } from "@/components/features/StaffPersonalInfoSection"
import { StaffEmploymentSection } from "@/components/features/StaffEmploymentSection"
import { StaffCompensationSection } from "@/components/features/StaffCompensationSection"

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

    if (staffId) {
      fetchStaff()
    }
  }, [staffId])

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="p-6">
            <div className="flex items-center justify-center min-h-screen">
              <Spinner />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !staff) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="p-6">
            <div className="max-w-2xl">
              <H1>Staff Profile</H1>
              <div className="mt-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || "Staff member not found"}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-6">
          <div className="max-w-4xl">
            <div className="mb-8">
              <H1>
                {staff.firstName} {staff.lastName}
              </H1>
              <Muted className="mt-2">{staff.role} in {staff.department}</Muted>
            </div>

            <div className="space-y-8">
              <StaffOverviewSection staff={staff} />
              <StaffPersonalInfoSection staff={staff} />
              <StaffEmploymentSection staff={staff} />
              <StaffCompensationSection staff={staff} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
