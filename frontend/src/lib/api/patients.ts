import { Patient } from '@/types/patient'

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    mrn: 'MRN001234',
    dateOfBirth: '03/15/1985',
    age: 39,
    status: 'active',
    primaryProvider: 'Dr. Smith',
    insurance: 'Blue Cross Blue Shield',
    lastVisit: '11/28/2024',
    nextAppointment: '12/15/2024',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    mrn: 'MRN001235',
    dateOfBirth: '07/22/2010',
    age: 14,
    status: 'evaluation',
    primaryProvider: 'Dr. Johnson',
    insurance: 'Aetna',
    lastVisit: '11/20/2024',
    nextAppointment: '12/12/2024',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.r@email.com',
    mrn: 'MRN001236',
    dateOfBirth: '12/03/1978',
    age: 45,
    status: 'discharged',
    primaryProvider: 'Dr. Williams',
    insurance: 'Medicare',
    lastVisit: '11/05/2024',
    nextAppointment: null,
  },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const lower = query.toLowerCase()
  return MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.mrn.toLowerCase().includes(lower) ||
      p.email.toLowerCase().includes(lower)
  )
}

export async function getPatientsByStatus(status: string): Promise<Patient[]> {
  if (!status) return MOCK_PATIENTS
  return MOCK_PATIENTS.filter((p) => p.status === status)
}
