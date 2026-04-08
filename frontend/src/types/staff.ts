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
}

/** Raw shape coming from the backend API */
export interface ApiStaffRecord {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string | null
  status: string
  hireDate: string | null
  address?: string | null
  emergency_contact?: string | null
  employee_id?: string | null
  position?: string | null
  start_date?: string | null
  work_location?: string | null
  pay_type?: string | null
  pay_rate?: number | null
  pay_frequency?: string | null
  benefits_enrolled?: string | null
  earnings?: number | null
  clients_count?: number | null
  utilized_hours?: number | null
  cancelled_hours?: number | null
}

/** Map a backend record to the frontend StaffMember shape */
export function mapApiToStaffMember(raw: ApiStaffRecord): StaffMember {
  const nameParts = raw.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const payrollStatus: PayrollStatus =
    raw.benefits_enrolled === "true" || raw.benefits_enrolled === "Enrolled"
      ? "Enrolled"
      : raw.benefits_enrolled === "Pending"
        ? "Pending"
        : "Not Enrolled"

  return {
    id: String(raw.id),
    firstName,
    lastName,
    email: raw.email,
    role: raw.role,
    department: raw.department,
    teams: [raw.department],
    status: (raw.status as StaffStatus) || "Active",
    payrollStatus,
    startDate: raw.hireDate ?? raw.start_date ?? "",
    phone: raw.phone ?? "",
    address: raw.address ?? undefined,
    emergency_contact: raw.emergency_contact ?? undefined,
    employee_id: raw.employee_id ?? undefined,
    position: raw.position ?? undefined,
    start_date: raw.start_date ?? undefined,
    work_location: raw.work_location ?? undefined,
    pay_type: raw.pay_type ?? undefined,
    pay_rate: raw.pay_rate ?? undefined,
    pay_frequency: raw.pay_frequency ?? undefined,
    benefits_enrolled: raw.benefits_enrolled ?? undefined,
    earnings: raw.earnings ?? undefined,
    clients_count: raw.clients_count ?? undefined,
    utilized_hours: raw.utilized_hours ?? undefined,
    cancelled_hours: raw.cancelled_hours ?? undefined,
  }
}

export interface CreateStaffRequest {
  name: string
  email: string
  role: string
  department: string
  status: StaffStatus
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

export type UpdateStaffRequest = Partial<CreateStaffRequest>
