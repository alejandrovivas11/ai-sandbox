import type {
  Patient,
  PatientCreate,
  PatientUpdate,
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  DashboardStats,
} from "./types";
import {
  PatientSchema,
  AppointmentSchema,
  DashboardStatsSchema,
} from "./schemas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      body
    );
  }

  const data: T = await response.json();
  return data;
}

// --- Patient CRUD ---

export async function getPatients(): Promise<Patient[]> {
  const data = await request<Patient[]>("/patients");
  return data.map((item) => PatientSchema.parse(item));
}

export async function getPatient(id: number): Promise<Patient> {
  const data = await request<Patient>(`/patients/${id}`);
  return PatientSchema.parse(data);
}

export async function createPatient(
  payload: PatientCreate
): Promise<Patient> {
  const data = await request<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return PatientSchema.parse(data);
}

export async function updatePatient(
  id: number,
  payload: PatientUpdate
): Promise<Patient> {
  const data = await request<Patient>(`/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return PatientSchema.parse(data);
}

export async function deletePatient(id: number): Promise<void> {
  await request<void>(`/patients/${id}`, { method: "DELETE" });
}

// --- Appointment CRUD ---

export async function getAppointments(): Promise<Appointment[]> {
  const data = await request<Appointment[]>("/appointments");
  return data.map((item) => AppointmentSchema.parse(item));
}

export async function getAppointment(id: number): Promise<Appointment> {
  const data = await request<Appointment>(`/appointments/${id}`);
  return AppointmentSchema.parse(data);
}

export async function createAppointment(
  payload: AppointmentCreate
): Promise<Appointment> {
  const data = await request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return AppointmentSchema.parse(data);
}

export async function updateAppointment(
  id: number,
  payload: AppointmentUpdate
): Promise<Appointment> {
  const data = await request<Appointment>(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return AppointmentSchema.parse(data);
}

export async function deleteAppointment(id: number): Promise<void> {
  await request<void>(`/appointments/${id}`, { method: "DELETE" });
}

// --- Dashboard ---

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await request<DashboardStats>("/dashboard/stats");
  return DashboardStatsSchema.parse(data);
}
