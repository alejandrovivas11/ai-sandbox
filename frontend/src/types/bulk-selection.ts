export interface BulkRecord {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  date: string
  type: string
  assignee: string
}

export interface BulkSelectionFilters {
  search: string
  status: string
}
