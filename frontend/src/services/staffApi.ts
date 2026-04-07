import type {
  StaffMember,
  StaffApiResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  StaffStatus,
  PayrollStatus,
} from "@/types/staff"

const API_BASE = "/api/staff"

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function mapApiResponseToStaffMember(res: StaffApiResponse): StaffMember {
  const nameParts = res.name.trim().split(/\s+/)
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const validStatuses: StaffStatus[] = ["Active", "Onboarding", "Inactive"]
  const status: StaffStatus = validStatuses.includes(res.status as StaffStatus)
    ? (res.status as StaffStatus)
    : "Active"

  return {
    id: String(res.id),
    firstName,
    lastName,
    email: res.email,
    role: res.role,
    department: res.department,
    teams: [],
    status,
    payrollStatus: "Enrolled" as PayrollStatus,
    startDate: res.hireDate ?? "",
    phone: res.phone ?? "",
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new ApiError(message, response.status)
  }
  return response.json()
}

export async function getAllStaff(params?: {
  search?: string
  role?: string
  department?: string
}): Promise<StaffMember[]> {
  const url = new URL(API_BASE, window.location.origin)
  if (params?.search) url.searchParams.set("search", params.search)
  if (params?.role) url.searchParams.set("role", params.role)
  if (params?.department) url.searchParams.set("department", params.department)

  const response = await fetch(url.toString())
  const data = await handleResponse<StaffApiResponse[]>(response)
  return data.map(mapApiResponseToStaffMember)
}

export async function getStaffById(id: string): Promise<StaffMember> {
  const response = await fetch(`${API_BASE}/${id}`)
  const data = await handleResponse<StaffApiResponse>(response)
  return mapApiResponseToStaffMember(data)
}

export async function createStaff(
  request: CreateStaffRequest
): Promise<StaffMember> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  const data = await handleResponse<StaffApiResponse>(response)
  return mapApiResponseToStaffMember(data)
}

export async function updateStaff(
  id: string,
  request: UpdateStaffRequest
): Promise<StaffMember> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  const data = await handleResponse<StaffApiResponse>(response)
  return mapApiResponseToStaffMember(data)
}

export async function deleteStaff(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new ApiError(message, response.status)
  }
}
