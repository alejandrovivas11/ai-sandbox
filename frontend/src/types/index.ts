export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface PatientListResponse {
  items: Patient[];
  total: number;
  page: number;
  per_page: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentListResponse {
  items: Appointment[];
  total: number;
  page: number;
  per_page: number;
}

export interface DashboardMetrics {
  total_patients: number;
  total_appointments: number;
  upcoming_appointments: number;
  recent_patients: Patient[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
