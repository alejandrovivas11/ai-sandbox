import { Provider, InsuranceProvider } from '@/types/patient'

const MOCK_PROVIDERS: Provider[] = [
  { id: 'dr_smith', name: 'Dr. Smith' },
  { id: 'dr_johnson', name: 'Dr. Johnson' },
  { id: 'dr_williams', name: 'Dr. Williams' },
]

const MOCK_INSURANCE: InsuranceProvider[] = [
  { id: 'bcbs', name: 'Blue Cross Blue Shield' },
  { id: 'aetna', name: 'Aetna' },
  { id: 'medicare', name: 'Medicare' },
  { id: 'medicaid', name: 'Medicaid' },
]

export async function getProviders(): Promise<Provider[]> {
  return MOCK_PROVIDERS
}

export async function getInsuranceProviders(): Promise<InsuranceProvider[]> {
  return MOCK_INSURANCE
}
