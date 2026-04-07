import { H2, Muted } from "@/components/ui/Typography"
import { StaffTable } from "@/components/features/StaffTable"
import { mockStaff } from "@/data/mockStaff"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <H2>Staff Management</H2>
        <Muted>Manage your healthcare team members, roles, and statuses.</Muted>
      </div>
      <StaffTable data={mockStaff} />
    </div>
  )
}
