export type TargetStatus = 'Active' | 'In Progress' | 'On Hold' | 'Failed' | 'Scheduled' | 'Completed'

export interface Target {
  id: string
  name: string
  status: TargetStatus
  program: string
  progress: number
  category: string
  author: string
  timestamp: string
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
}

export interface Program {
  id: string
  name: string
  phases: Phase[]
}
