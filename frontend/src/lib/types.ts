/** TypeScript interfaces matching backend Pydantic models exactly. */

export interface Patient {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

export interface PatientUpdate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_name: string;
  datetime: string;
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  patient_id: number;
  doctor_name: string;
  datetime: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentUpdate {
  patient_id?: number | null;
  doctor_name?: string | null;
  datetime?: string | null;
  status?: AppointmentStatus | null;
  notes?: string | null;
}

export interface DashboardStats {
  total_patients: number;
  total_appointments: number;
  upcoming_appointments: number;
  completed_appointments: number;
}
