export type TargetStatus = 'Active' | 'In Progress' | 'On Hold'

export interface Target {
  id: string
  name: string
  program: string
  status: TargetStatus
  selected: boolean
}

export interface Patient {
  id: string
  name: string
  currentLocation: string
}

export interface Phase {
  id: string
  name: string
  programId: string
}

export interface Program {
  id: string
  name: string
  phases: Phase[]
}
