export type TargetStatus = "Active" | "In Progress" | "Completed" | "Draft"

export type TargetCategory = "Social" | "Behavioral" | "Communication" | "Academic"

export interface Target {
  id: string
  description: string
  status: TargetStatus
  category: TargetCategory
  programId: string
  selected: boolean
}

export interface Program {
  id: string
  name: string
  type: string
  year: number
  active: boolean
}

export interface Client {
  id: string
  name: string
  organizationName: string
}
