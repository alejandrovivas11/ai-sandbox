import type { Patient } from '@/types/patient'

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    patientId: 'PAT-2024-001',
    dateOfBirth: '03/15/2018',
    age: 6,
    primaryDiagnosis: 'Articulation Disorder',
    status: 'Active Treatment',
    provider: 'Dr. Sarah Johnson',
    payer: 'Blue Cross Blue Shield',
    authorizationStatus: 'Approved',
    nextAppointment: '12/15/2024',
    diagnosisCategory: 'articulation',
    serviceType: 'individual',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    patientId: 'PAT-2024-002',
    dateOfBirth: '08/22/2020',
    age: 4,
    primaryDiagnosis: 'Language Delay',
    status: 'Evaluation',
    provider: 'Dr. Mike Chen',
    payer: 'Medicaid',
    authorizationStatus: 'Pending',
    nextAppointment: '12/18/2024',
    diagnosisCategory: 'language',
    serviceType: 'individual',
  },
  {
    id: '3',
    name: 'Sofia Patel',
    patientId: 'PAT-2024-003',
    dateOfBirth: '11/10/2015',
    age: 9,
    primaryDiagnosis: 'Fluency Disorder',
    status: 'Active Treatment',
    provider: 'Dr. Lisa Rodriguez',
    payer: 'Aetna',
    authorizationStatus: 'Approved',
    nextAppointment: '12/20/2024',
    diagnosisCategory: 'fluency',
    serviceType: 'individual',
  },
]

export async function getPatients(): Promise<Patient[]> {
  return MOCK_PATIENTS
}

export function getPatientsMock(): Patient[] {
  return MOCK_PATIENTS
}

export const TOTAL_PATIENTS = 142

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'referral', label: 'Referral' },
  { value: 'intake', label: 'Intake' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'active_treatment', label: 'Active Treatment' },
  { value: 'discharge', label: 'Discharge' },
]

export const PROVIDER_OPTIONS = [
  { value: 'all', label: 'All Providers' },
  { value: 'Dr. Sarah Johnson', label: 'Dr. Sarah Johnson' },
  { value: 'Dr. Mike Chen', label: 'Dr. Mike Chen' },
  { value: 'Dr. Lisa Rodriguez', label: 'Dr. Lisa Rodriguez' },
]

export const PAYER_OPTIONS = [
  { value: 'all', label: 'All Payers' },
  { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield' },
  { value: 'Aetna', label: 'Aetna' },
  { value: 'Medicare', label: 'Medicare' },
  { value: 'Medicaid', label: 'Medicaid' },
]

export const DIAGNOSIS_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'articulation', label: 'Articulation' },
  { value: 'language', label: 'Language' },
  { value: 'fluency', label: 'Fluency' },
  { value: 'voice', label: 'Voice' },
  { value: 'dysphagia', label: 'Dysphagia' },
  { value: 'cognitive_communication', label: 'Cognitive Communication' },
]

export const SERVICE_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'individual', label: 'Individual' },
  { value: 'group', label: 'Group' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'caregiver_training', label: 'Caregiver Training' },
]

export const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]
