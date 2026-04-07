// ─── Document Vault Types ────────────────────────────────────────────────────

export type DocumentFolder =
  | 'Licenses'
  | 'Certifications'
  | 'Insurance'
  | 'Contracts'

export type DocumentStatus =
  | 'Active'
  | 'Expiring Soon'
  | 'Expired'
  | 'Flagged'

export interface ProviderDocument {
  id: string
  name: string
  folder: DocumentFolder
  status: DocumentStatus
  uploadedBy: string
  uploadedAt: string       // ISO date string
  expiryDate: string | null // ISO date string, null if no expiry
  fileSize: string          // e.g. "2.4 MB"
  fileType: string          // e.g. "PDF"
  notes?: string
}

export interface DocumentVaultSummary {
  totalDocuments: number
  expiringSoon: number     // within 30 days
  flagged: number
  expired: number
}

export interface DocumentUploadPayload {
  name: string
  folder: DocumentFolder
  expiryDate: string | null
  file: File
}

export interface DocumentReplacePayload {
  documentId: string
  file: File
}

export type DocumentFilterStatus = DocumentStatus | 'All'
export type DocumentFilterFolder = DocumentFolder | 'All'

export interface DocumentFilters {
  folder: DocumentFilterFolder
  status: DocumentFilterStatus
  search: string
}
