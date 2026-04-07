import { z } from "zod";

export const PatientSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").nullable(),
  phone: z.string().min(1, "Phone is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PatientCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});

export const PatientUpdateSchema = z.object({
  name: z.string().min(1).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(1).nullable().optional(),
  date_of_birth: z.string().min(1).nullable().optional(),
});

const AppointmentStatusSchema = z.enum([
  "scheduled",
  "completed",
  "cancelled",
]);

export const AppointmentSchema = z.object({
  id: z.number().int(),
  patient_id: z.number().int(),
  doctor_name: z.string(),
  datetime: z.string(),
  status: AppointmentStatusSchema,
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AppointmentCreateSchema = z.object({
  patient_id: z.number().int(),
  doctor_name: z.string().min(1, "Doctor name is required"),
  datetime: z.string().min(1, "Datetime is required"),
  status: AppointmentStatusSchema.optional(),
  notes: z.string().optional(),
});

export const AppointmentUpdateSchema = z.object({
  patient_id: z.number().int().nullable().optional(),
  doctor_name: z.string().min(1).nullable().optional(),
  datetime: z.string().min(1).nullable().optional(),
  status: AppointmentStatusSchema.nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const DashboardStatsSchema = z.object({
  total_patients: z.number().int(),
  total_appointments: z.number().int(),
  upcoming_appointments: z.number().int(),
  completed_appointments: z.number().int(),
});
