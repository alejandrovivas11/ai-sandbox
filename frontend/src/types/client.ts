export type ClientStatus = 'Active' | 'On Hold' | 'Pending' | 'Discharged' | 'Inactive'

export interface Client {
  id: string
  name: string
  initials: string
  status: ClientStatus
}

export interface StatusOption {
  value: ClientStatus
  label: string
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
}
