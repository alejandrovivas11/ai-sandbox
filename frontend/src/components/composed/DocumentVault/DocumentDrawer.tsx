'use client'

import { useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Button,
  Separator,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import type { ProviderDocument } from '@/types/documents'
import {
  Download,
  Shield,
  Flag,
  RefreshCw,
  Trash2,
  FileText,
  X,
} from 'lucide-react'

interface DocumentDrawerProps {
  document: ProviderDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (doc: ProviderDocument) => void
  onVerify: (doc: ProviderDocument) => Promise<void>
  onFlag: (doc: ProviderDocument) => Promise<void>
  onReplace: (doc: ProviderDocument) => void
  onDelete: (doc: ProviderDocument) => Promise<void>
  isActioning?: boolean
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

export function DocumentDrawer({
  document,
  open,
  onOpenChange,
  onDownload,
  onVerify,
  onFlag,
  onReplace,
  onDelete,
  isActioning = false,
}: DocumentDrawerProps) {
  if (!document) return null

  const isExpiredOrExpiring =
    document.status === 'Expired' || document.status === 'Expiring Soon'

  function formatDate(iso: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[420px] sm:w-[480px] flex flex-col gap-0 p-0 overflow-y-auto">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <SheetTitle className="text-base leading-snug truncate">
                  {document.name}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {document.folder}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {document.fileType}
                  </span>
                </SheetDescription>
              </div>
              <DocumentStatusBadge status={document.status} />
            </div>
          </SheetHeader>

          <Separator />

          {/* Preview placeholder */}
          <div className="flex flex-col items-center justify-center gap-3 mx-6 my-5 rounded-lg border border-dashed border-border bg-muted/40 py-10">
            <FileText className="w-10 h-10 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">
              Preview not available
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
              disabled={isActioning}
            >
              <Download className="w-4 h-4 mr-2" />
              Download to view
            </Button>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="flex flex-col gap-4 px-6 py-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Document details
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <MetaRow label="Uploaded by" value={document.uploadedBy} />
              <MetaRow label="Upload date" value={formatDate(document.uploadedAt)} />
              <MetaRow
                label="Expiry date"
                value={
                  document.expiryDate
                    ? `${formatDate(document.expiryDate)}${isExpiredOrExpiring ? ' ⚠' : ''}`
                    : 'No expiry'
                }
              />
              <MetaRow label="File size" value={document.fileSize} />
              <MetaRow label="File type" value={document.fileType} />
              <MetaRow label="Folder" value={document.folder} />
            </div>
            {document.notes && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Notes
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {document.notes}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-3 px-6 py-5 mt-auto">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </span>
            <div className="flex flex-wrap gap-2">
              {/* Download */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(document)}
                    disabled={isActioning}
                    aria-label="Download document"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download file</TooltipContent>
              </Tooltip>

              {/* Verify */}
              {document.status !== 'Active' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVerify(document)}
                      disabled={isActioning}
                      aria-label="Mark as verified"
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Verify
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark document as verified</TooltipContent>
                </Tooltip>
              )}

              {/* Flag */}
              {document.status !== 'Flagged' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFlag(document)}
                      disabled={isActioning}
                      aria-label="Flag document for review"
                    >
                      <Flag className="w-4 h-4 mr-1.5" />
                      Flag
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flag for review</TooltipContent>
                </Tooltip>
              )}

              {/* Replace */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReplace(document)}
                    disabled={isActioning}
                    aria-label="Replace document file"
                  >
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    Replace
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload a replacement file</TooltipContent>
              </Tooltip>

              {/* Delete */}
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActioning}
                        aria-label="Delete document"
                        className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete document permanently</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete document?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>{document.name}</strong> will be permanently deleted
                      from the vault. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(document)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
