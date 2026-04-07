"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import type { StaffMember, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff"
import { useCreateStaff } from "@/hooks/useCreateStaff"
import { useUpdateStaff } from "@/hooks/useUpdateStaff"

interface StaffFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: StaffMember | null
}

export function StaffFormDialog({
  open,
  onOpenChange,
  staff,
}: StaffFormDialogProps) {
  const isEditing = !!staff

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("")
  const [department, setDepartment] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [status, setStatus] = React.useState("Active")
  const [formError, setFormError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (staff) {
      setName(`${staff.firstName} ${staff.lastName}`.trim())
      setEmail(staff.email)
      setRole(staff.role)
      setDepartment(staff.department)
      setPhone(staff.phone)
      setStatus(staff.status)
    } else {
      setName("")
      setEmail("")
      setRole("")
      setDepartment("")
      setPhone("")
      setStatus("Active")
    }
    setFormError(null)
  }, [staff, open])

  const handleClose = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const createMutation = useCreateStaff({
    onSuccess: () => handleClose(),
    onError: (error) => setFormError(error),
  })

  const updateMutation = useUpdateStaff({
    onSuccess: () => handleClose(),
    onError: (error) => setFormError(error),
  })

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!name.trim() || !email.trim() || !role.trim() || !department.trim()) {
      setFormError("Please fill in all required fields.")
      return
    }

    if (isEditing && staff) {
      const request: UpdateStaffRequest = {
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        department: department.trim(),
        phone: phone.trim() || undefined,
        status,
      }
      updateMutation.mutate(staff.id, request)
    } else {
      const request: CreateStaffRequest = {
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        department: department.trim(),
        phone: phone.trim() || undefined,
        status,
      }
      createMutation.mutate(request)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the staff member details below."
              : "Fill in the details to add a new staff member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name *</Label>
            <Input
              id="staff-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Chen"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email *</Label>
            <Input
              id="staff-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah.chen@3yhealth.com"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff-role">Role *</Label>
              <Input
                id="staff-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Physician"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-department">Department *</Label>
              <Input
                id="staff-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Primary Care"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Phone</Label>
              <Input
                id="staff-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. (555) 101-2001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="staff-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
