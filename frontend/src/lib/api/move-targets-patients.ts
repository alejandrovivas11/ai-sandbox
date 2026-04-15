import { Patient } from '@/types/targets'

export async function getPatientForMoveTargets(): Promise<Patient> {
  return {
    id: 'pat-1',
    name: 'Sarah Johnson',
    currentLocation: 'Early Learning Program - Phase 1',
  }
}
