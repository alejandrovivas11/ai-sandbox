import type { StaffMember, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error")
    throw new ApiError(errorBody || response.statusText, response.status)
  }
  return response.json()
}

export async function getAllStaff(): Promise<StaffMember[]> {
  const response = await fetch(`${API_BASE_URL}/staff`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  return handleResponse<StaffMember[]>(response)
}

export async function getStaffById(id: string): Promise<StaffMember> {
  const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  return handleResponse<StaffMember>(response)
}

export async function createStaff(data: CreateStaffRequest): Promise<StaffMember> {
  const response = await fetch(`${API_BASE_URL}/staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<StaffMember>(response)
}

export async function updateStaff(id: string, data: Partial<CreateStaffRequest>): Promise<StaffMember> {
  const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<StaffMember>(response)
}

export async function deleteStaff(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error")
    throw new ApiError(errorBody || response.statusText, response.status)
  }
}
