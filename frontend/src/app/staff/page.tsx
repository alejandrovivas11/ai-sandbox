"use client"

import * as React from "react"
import { H2, Muted } from "@/components/ui/Typography"
import { StaffTable } from "@/components/features/StaffTable"
import { StaffFormDialog } from "@/components/features/StaffFormDialog"
import { useStaff } from "@/hooks/useStaff"
import { useDeleteStaff } from "@/hooks/useDeleteStaff"
import type { StaffMember } from "@/types/staff"

export default function StaffPage() {
  const { data, isLoading, isError, error, refetch } = useStaff()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingStaff, setEditingStaff] = React.useState<StaffMember | null>(null)

  const deleteMutation = useDeleteStaff(
    () => refetch(),
    () => {}
  )

  const handleAddStaff = () => {
    setEditingStaff(null)
    setDialogOpen(true)
  }

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member)
    setDialogOpen(true)
  }

  const handleDeleteStaff = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div>
        <H2>Staff Management</H2>
        <Muted>Manage your healthcare team members, roles, and statuses.</Muted>
      </div>
      <StaffTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        onAddStaff={handleAddStaff}
        onEditStaff={handleEditStaff}
        onDeleteStaff={handleDeleteStaff}
      />
      <StaffFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staff={editingStaff}
      />
    </div>
  )
}
