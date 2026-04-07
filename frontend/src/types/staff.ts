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
  createdAt?: string
  updatedAt?: string
}

export interface CreateStaffRequest {
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

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  id: string
}

export interface StaffResponse {
  data: StaffMember | StaffMember[]
  message?: string
  error?: string
}
