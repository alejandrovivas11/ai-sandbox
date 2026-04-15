import { Patient } from '@/types/patient'

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    status: 'Active',
    dateOfBirth: '1985-03-15',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    insurance: 'Aetna',
    assignedTherapist: 'Dr. Michael Chen',
    mrn: 'MRN-001234',
  },
  {
    id: '2',
    name: 'Michael Chen',
    status: 'Active',
    dateOfBirth: '1972-11-28',
    phone: '(555) 987-6543',
    email: 'm.chen@email.com',
    insurance: 'Blue Cross Blue Shield',
    assignedTherapist: 'Dr. Sarah Johnson',
    mrn: 'MRN-001235',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    status: 'Inactive',
    dateOfBirth: '1990-07-12',
    phone: '(555) 456-7890',
    email: 'emily.r@email.com',
    insurance: 'Medicare',
    assignedTherapist: 'Dr. Lisa Rodriguez',
    mrn: 'MRN-001236',
  },
  {
    id: '4',
    name: 'David Wilson',
    status: 'Active',
    dateOfBirth: '1965-09-03',
    phone: '(555) 321-0987',
    email: 'd.wilson@email.com',
    insurance: 'Aetna',
    assignedTherapist: 'Dr. David Kim',
    mrn: 'MRN-001237',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    status: 'Active',
    dateOfBirth: '1978-12-20',
    phone: '(555) 654-3210',
    email: 'lisa.t@email.com',
    insurance: 'Blue Cross Blue Shield',
    assignedTherapist: 'Dr. Michael Chen',
    mrn: 'MRN-001238',
  },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}

export function getPatientsMock(): Patient[] {
  return MOCK_PATIENTS
}
