import { Patient } from '@/types/patient'

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    status: 'Active',
    dateOfBirth: '03/15/1985',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    insurance: 'BlueCross BlueShield',
    assignedTherapist: 'Dr. Michael Chen',
    mrn: 'MRN-001234',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    status: 'On Hold',
    dateOfBirth: '07/22/1978',
    phone: '(555) 234-5678',
    email: 'michael.rodriguez@email.com',
    insurance: 'Aetna',
    assignedTherapist: 'Dr. Sarah Johnson',
    mrn: 'MRN-001235',
  },
  {
    id: '3',
    name: 'Emily Davis',
    status: 'Active',
    dateOfBirth: '11/08/1992',
    phone: '(555) 345-6789',
    email: 'emily.davis@email.com',
    insurance: 'Cigna',
    assignedTherapist: 'Dr. Lisa Rodriguez',
    mrn: 'MRN-001236',
  },
  {
    id: '4',
    name: 'David Kim',
    status: 'Pending',
    dateOfBirth: '05/12/1990',
    phone: '(555) 456-7890',
    email: 'david.kim@email.com',
    insurance: 'United Healthcare',
    assignedTherapist: 'Dr. David Kim',
    mrn: 'MRN-001237',
  },
  {
    id: '5',
    name: 'Jessica Wilson',
    status: 'Discharged',
    dateOfBirth: '09/30/1987',
    phone: '(555) 567-8901',
    email: 'jessica.wilson@email.com',
    insurance: 'Medicare',
    assignedTherapist: 'Dr. Michael Chen',
    mrn: 'MRN-001238',
  },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}
