export type StaffStatus = "Active" | "Onboarding" | "Inactive"

export type PayrollStatus = "Enrolled" | "Pending" | "Not Enrolled"

export interface StaffMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  teams: string[]
  status: StaffStatus
  payrollStatus: PayrollStatus
  startDate: string
  phone: string
}
