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
import { Alert, AlertContent, AlertDescription } from "@/components/ui/Alert"
import { useCreateStaff } from "@/hooks/useCreateStaff"
import { useUpdateStaff } from "@/hooks/useUpdateStaff"
import type { StaffMember, StaffStatus, PayrollStatus } from "@/types/staff"

interface StaffFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: StaffMember | null
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  phone: string
  status: StaffStatus
  payrollStatus: PayrollStatus
  startDate: string
  teams: string
}

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  department: "",
  phone: "",
  status: "Active",
  payrollStatus: "Pending",
  startDate: "",
  teams: "",
}

export function StaffFormDialog({ open, onOpenChange, staff }: StaffFormDialogProps) {
  const isEditing = !!staff
  const [form, setForm] = React.useState<FormData>(emptyForm)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({})
  const [apiError, setApiError] = React.useState<string | null>(null)

  const createStaff = useCreateStaff(
    () => {
      onOpenChange(false)
      setForm(emptyForm)
    },
    (err) => setApiError(err.message)
  )

  const updateStaffMutation = useUpdateStaff(
    () => {
      onOpenChange(false)
    },
    (err) => setApiError(err.message)
  )

  React.useEffect(() => {
    if (staff) {
      setForm({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        phone: staff.phone,
        status: staff.status,
        payrollStatus: staff.payrollStatus,
        startDate: staff.startDate,
        teams: staff.teams.join(", "),
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setApiError(null)
  }, [staff, open])

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format"
    if (!form.role.trim()) newErrors.role = "Role is required"
    if (!form.department.trim()) newErrors.department = "Department is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      department: form.department.trim(),
      phone: form.phone.trim(),
      status: form.status,
      payrollStatus: form.payrollStatus,
      startDate: form.startDate || new Date().toISOString().split("T")[0],
      teams: form.teams
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    if (isEditing && staff) {
      updateStaffMutation.mutate(staff.id, payload)
    } else {
      createStaff.mutate(payload)
    }
  }

  const isSubmitting = createStaff.isLoading || updateStaffMutation.isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the staff member details below."
              : "Fill in the details to add a new staff member."}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <Alert variant="destructive">
            <AlertContent>
              <AlertDescription>{apiError}</AlertDescription>
            </AlertContent>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={errors.role ? "border-destructive" : ""}
              />
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className={errors.department ? "border-destructive" : ""}
              />
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payroll Status</Label>
              <Select
                value={form.payrollStatus}
                onValueChange={(v) => handleChange("payrollStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enrolled">Enrolled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Not Enrolled">Not Enrolled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teams">Teams (comma-separated)</Label>
            <Input
              id="teams"
              value={form.teams}
              onChange={(e) => handleChange("teams", e.target.value)}
              placeholder="Team Alpha, Team Beta"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
