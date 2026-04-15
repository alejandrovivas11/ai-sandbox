export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  status: "active" | "inactive" | "discharged"
  phone: string
  insurance: string
  therapist: string
  mrn: string
}

export interface Therapist {
  id: string
  name: string
}
