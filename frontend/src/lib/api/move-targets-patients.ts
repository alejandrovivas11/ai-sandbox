import { Patient } from '@/types/targets'

export async function getPatientForMoveTargets(): Promise<Patient> {
  return {
    id: 'p1',
    name: 'Jane Doe',
    currentLocation: 'Program A - Phase 2',
  }
}
