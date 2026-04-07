'use client'

import { useState, useMemo, useTransition } from 'react'
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
  TooltipProvider,
} from '@/components/ui'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { DocumentUploadDialog } from './DocumentUploadDialog'
import { DocumentDrawer } from './DocumentDrawer'
import type {
  ProviderDocument,
  DocumentVaultSummary,
  DocumentFolder,
  DocumentFilterStatus,
  DocumentFilterFolder,
  DocumentUploadPayload,
} from '@/types/documents'
import {
  Upload,
  Search,
  FileText,
  AlertTriangle,
  Flag,
  CheckCircle2,
  Clock,
  Files,
} from 'lucide-react'

// ─── Sample data ─────────────────────────────────────────────────────────────
// Replace with real data fetching via your API layer

const SAMPLE_DOCUMENTS: ProviderDocument[] = [
  {
    id: '1',
    name: 'Medical License — California 2025',
    folder: 'Licenses',
    status: 'Active',
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2025-01-15T10:30:00Z',
    expiryDate: '2026-01-14T00:00:00Z',
    fileSize: '1.2 MB',
    fileType: 'PDF',
  },
  {
    id: '2',
    name: 'DEA Registration Certificate',
    folder: 'Licenses',
    status: 'Expiring Soon',
    uploadedBy: 'Marcus Webb',
    uploadedAt: '2024-04-03T09:15:00Z',
    expiryDate: '2026-04-15T00:00:00Z',
    fileSize: '0.8 MB',
    fileType: 'PDF',
    notes: 'Renewal application submitted on March 10.',
  },
  {
    id: '3',
    name: 'Board Certification — Internal Medicine',
    folder: 'Certifications',
    status: 'Active',
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2025-02-20T14:00:00Z',
    expiryDate: '2027-02-19T00:00:00Z',
    fileSize: '2.4 MB',
    fileType: 'PDF',
  },
  {
    id: '4',
    name: 'BLS / ACLS Certification',
    folder: 'Certifications',
    status: 'Expired',
    uploadedBy: 'Marcus Webb',
    uploadedAt: '2023-06-10T11:00:00Z',
    expiryDate: '2025-06-09T00:00:00Z',
    fileSize: '0.5 MB',
    fileType: 'PDF',
  },
  {
    id: '5',
    name: 'Malpractice Insurance — 2025',
    folder: 'Insurance',
    status: 'Active',
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2025-01-05T08:00:00Z',
    expiryDate: '2026-01-04T00:00:00Z',
    fileSize: '3.1 MB',
    fileType: 'PDF',
  },
  {
    id: '6',
    name: 'General Liability Certificate',
    folder: 'Insurance',
    status: 'Flagged',
    uploadedBy: 'Marcus Webb',
    uploadedAt: '2024-11-22T16:30:00Z',
    expiryDate: '2025-11-21T00:00:00Z',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    notes: 'Coverage limits may not meet new network requirements — confirm with compliance team.',
  },
  {
    id: '7',
    name: 'Provider Services Agreement',
    folder: 'Contracts',
    status: 'Active',
    uploadedBy: 'Jordan Lee',
    uploadedAt: '2024-09-01T10:00:00Z',
    expiryDate: null,
    fileSize: '4.7 MB',
    fileType: 'PDF',
  },
  {
    id: '8',
    name: 'Non-Disclosure Agreement',
    folder: 'Contracts',
    status: 'Active',
    uploadedBy: 'Jordan Lee',
    uploadedAt: '2024-09-01T10:05:00Z',
    expiryDate: null,
    fileSize: '0.6 MB',
    fileType: 'PDF',
  },
]

const FOLDERS: DocumentFolder[] = [
  'Licenses',
  'Certifications',
  'Insurance',
  'Contracts',
]

const STATUS_FILTER_OPTIONS: DocumentFilterStatus[] = [
  'All',
  'Active',
  'Expiring Soon',
  'Expired',
  'Flagged',
]

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: number
  highlight?: 'warning' | 'danger' | 'info'
}) {
  const valueColor =
    highlight === 'danger'
      ? 'text-[#dc2626]'
      : highlight === 'warning'
      ? 'text-[#d97706]'
      : highlight === 'info'
      ? 'text-[#7c3aed]'
      : 'text-foreground'

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-muted-foreground uppercase tracking-wide leading-none">
          {label}
        </span>
        <span className={`text-2xl font-bold leading-tight ${valueColor}`}>
          {value}
        </span>
      </div>
    </div>
  )
}

// ─── Document Row ─────────────────────────────────────────────────────────────

function DocumentRow({
  doc,
  onClick,
}: {
  doc: ProviderDocument
  onClick: () => void
}) {
  function formatDate(iso: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset rounded-sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      aria-label={`Open ${doc.name}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
        <FileText className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Name + folder */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {doc.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {doc.folder} · {doc.fileSize}
        </span>
      </div>

      {/* Expiry */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 w-32">
        <span className="text-xs text-muted-foreground">Expires</span>
        <span
          className={`text-xs font-medium ${
            doc.status === 'Expired'
              ? 'text-[#dc2626]'
              : doc.status === 'Expiring Soon'
              ? 'text-[#d97706]'
              : 'text-foreground'
          }`}
        >
          {formatDate(doc.expiryDate)}
        </span>
      </div>

      {/* Uploaded by */}
      <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 w-32">
        <span className="text-xs text-muted-foreground">Uploaded by</span>
        <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
          {doc.uploadedBy}
        </span>
      </div>

      {/* Status */}
      <div className="shrink-0 w-28 flex justify-end">
        <DocumentStatusBadge status={doc.status} />
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function VaultEmptyState({
  hasFilters,
  onUpload,
}: {
  hasFilters: boolean
  onUpload: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
        <Files className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <span className="text-sm font-medium text-foreground">
          {hasFilters ? 'No documents match your filters' : 'No documents yet'}
        </span>
        <span className="text-sm text-muted-foreground">
          {hasFilters
            ? 'Try adjusting your search or filter criteria.'
            : "Upload compliance documents to keep this provider's vault organized and up to date."}
        </span>
      </div>
      {!hasFilters && (
        <Button size="sm" onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload first document
        </Button>
      )}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function VaultSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0">
          <Skeleton className="w-8 h-8 rounded-md shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="hidden sm:block h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

interface DocumentVaultPageProps {
  providerId: string
  providerName: string
  /** Pass `true` while loading documents from your API */
  isLoading?: boolean
  /** Pass documents from your API. When undefined + not loading, sample data is used. */
  documents?: ProviderDocument[]
}

export function DocumentVaultPage({
  providerId,
  providerName,
  isLoading = false,
  documents: externalDocuments,
}: DocumentVaultPageProps) {
  const documents = externalDocuments ?? SAMPLE_DOCUMENTS

  const [activeFolder, setActiveFolder] = useState<DocumentFilterFolder>('All')
  const [statusFilter, setStatusFilter] = useState<DocumentFilterStatus>('All')
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [replaceTarget, setReplaceTarget] = useState<ProviderDocument | null>(null)
  const [drawerDoc, setDrawerDoc] = useState<ProviderDocument | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [, startTransition] = useTransition()

  // Computed summary
  const summary: DocumentVaultSummary = useMemo(() => ({
    totalDocuments: documents.length,
    expiringSoon: documents.filter((d) => d.status === 'Expiring Soon').length,
    flagged: documents.filter((d) => d.status === 'Flagged').length,
    expired: documents.filter((d) => d.status === 'Expired').length,
  }), [documents])

  // Filtered view
  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      if (activeFolder !== 'All' && doc.folder !== activeFolder) return false
      if (statusFilter !== 'All' && doc.status !== statusFilter) return false
      if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [documents, activeFolder, statusFilter, search])

  const hasFilters =
    activeFolder !== 'All' || statusFilter !== 'All' || search.length > 0

  function openDrawer(doc: ProviderDocument) {
    setDrawerDoc(doc)
    setDrawerOpen(true)
  }

  // ── Action handlers (wire to your API layer) ──

  async function handleUpload(payload: DocumentUploadPayload) {
    // TODO: POST /api/providers/:providerId/documents
    console.log('Upload:', payload)
    // On success: refetch documents or optimistically add to list
  }

  async function handleVerify(doc: ProviderDocument) {
    // TODO: PATCH /api/documents/:id { status: 'Active' }
    console.log('Verify:', doc.id)
    setDrawerOpen(false)
  }

  async function handleFlag(doc: ProviderDocument) {
    // TODO: PATCH /api/documents/:id { status: 'Flagged' }
    console.log('Flag:', doc.id)
    setDrawerOpen(false)
  }

  function handleReplace(doc: ProviderDocument) {
    setReplaceTarget(doc)
    setDrawerOpen(false)
  }

  async function handleReplaceUpload(payload: DocumentUploadPayload) {
    // TODO: PUT /api/documents/:id with new file
    console.log('Replace:', replaceTarget?.id, payload)
    setReplaceTarget(null)
  }

  function handleDownload(doc: ProviderDocument) {
    // TODO: GET /api/documents/:id/download → trigger browser download
    console.log('Download:', doc.id)
  }

  async function handleDelete(doc: ProviderDocument) {
    // TODO: DELETE /api/documents/:id
    console.log('Delete:', doc.id)
    setDrawerOpen(false)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
            <p className="text-sm text-muted-foreground">{providerName}</p>
          </div>
          <Button onClick={() => setUploadOpen(true)} disabled={isLoading}>
            <Upload className="w-4 h-4 mr-2" />
            Upload document
          </Button>
        </div>

        {/* Summary cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              icon={<Files className="w-5 h-5 text-muted-foreground" />}
              label="Total documents"
              value={summary.totalDocuments}
            />
            <SummaryCard
              icon={<Clock className="w-5 h-5 text-[#d97706]" />}
              label="Expiring soon"
              value={summary.expiringSoon}
              highlight={summary.expiringSoon > 0 ? 'warning' : undefined}
            />
            <SummaryCard
              icon={<AlertTriangle className="w-5 h-5 text-[#dc2626]" />}
              label="Expired"
              value={summary.expired}
              highlight={summary.expired > 0 ? 'danger' : undefined}
            />
            <SummaryCard
              icon={<Flag className="w-5 h-5 text-[#7c3aed]" />}
              label="Flagged"
              value={summary.flagged}
              highlight={summary.flagged > 0 ? 'info' : undefined}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Folder tabs */}
          <Tabs
            value={activeFolder}
            onValueChange={(v) => setActiveFolder(v as DocumentFilterFolder)}
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="All">All folders</TabsTrigger>
              {FOLDERS.map((f) => (
                <TabsTrigger key={f} value={f}>
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search + status filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                disabled={isLoading}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as DocumentFilterStatus)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'All' ? 'All statuses' : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Document list */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Column header */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-muted/40">
              <div className="w-8 shrink-0" />
              <span className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Document
              </span>
              <span className="hidden sm:block text-xs font-medium text-muted-foreground uppercase tracking-wide w-32 text-right">
                Expires
              </span>
              <span className="hidden md:block text-xs font-medium text-muted-foreground uppercase tracking-wide w-32 text-right">
                Uploaded by
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide w-28 text-right">
                Status
              </span>
            </div>

            {isLoading ? (
              <VaultSkeleton />
            ) : filtered.length === 0 ? (
              <VaultEmptyState
                hasFilters={hasFilters}
                onUpload={() => setUploadOpen(true)}
              />
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onClick={() => openDrawer(doc)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground -mt-2">
            Showing {filtered.length} of {documents.length} document
            {documents.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Upload dialog */}
        <DocumentUploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onUpload={handleUpload}
        />

        {/* Replace dialog */}
        {replaceTarget && (
          <DocumentUploadDialog
            open={!!replaceTarget}
            onOpenChange={(open) => {
              if (!open) setReplaceTarget(null)
            }}
            onUpload={handleReplaceUpload}
          />
        )}

        {/* Document drawer */}
        <DocumentDrawer
          document={drawerDoc}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onDownload={handleDownload}
          onVerify={handleVerify}
          onFlag={handleFlag}
          onReplace={handleReplace}
          onDelete={handleDelete}
        />
      </div>
    </TooltipProvider>
  )
}
