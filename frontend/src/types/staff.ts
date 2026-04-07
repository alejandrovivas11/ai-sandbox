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
  address?: string
  emergency_contact?: string
  employee_id?: string
  position?: string
  start_date?: string
  work_location?: string
  pay_type?: string
  pay_rate?: number
  pay_frequency?: string
  benefits_enrolled?: string
  earnings?: number
  clients_count?: number
  utilized_hours?: number
  cancelled_hours?: number
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
  address?: string
  emergency_contact?: string
  employee_id?: string
  position?: string
  start_date?: string
  work_location?: string
  pay_type?: string
  pay_rate?: number
  pay_frequency?: string
  benefits_enrolled?: string
  earnings?: number
  clients_count?: number
  utilized_hours?: number
  cancelled_hours?: number
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  id: string
}

export interface StaffResponse {
  data: StaffMember | StaffMember[]
  message?: string
  error?: string
}
