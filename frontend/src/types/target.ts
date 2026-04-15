export interface Target {
  id: string
  name: string
  status: string
  progress: number
  category: string
  author: string
  timestamp: string
  selected: boolean
}

export interface BulkActionRequest {
  targetIds: string[]
  action: string
  parameters: Record<string, unknown>
}

export interface TargetFilters {
  search: string
  status: string
  category: string
}
