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

export interface CreateStaffRequest {
  name: string
  role: string
  department: string
  email: string
  phone?: string
  status?: string
  hireDate?: string
}

export interface UpdateStaffRequest {
  name?: string
  role?: string
  department?: string
  email?: string
  phone?: string
  status?: string
  hireDate?: string
}

export interface StaffApiResponse {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string | null
  status: string
  hireDate: string | null
}
