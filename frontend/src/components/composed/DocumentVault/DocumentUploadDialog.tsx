'use client'

import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Field,
} from '@/components/ui'
import type { DocumentFolder, DocumentUploadPayload } from '@/types/documents'

const FOLDERS: DocumentFolder[] = [
  'Licenses',
  'Certifications',
  'Insurance',
  'Contracts',
]

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (payload: DocumentUploadPayload) => Promise<void>
}

interface FormErrors {
  name?: string
  folder?: string
  file?: string
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  onUpload,
}: DocumentUploadDialogProps) {
  const [name, setName] = useState('')
  const [folder, setFolder] = useState<DocumentFolder | ''>('')
  const [expiryDate, setExpiryDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Document name is required'
    if (!folder) errs.folder = 'Please select a folder'
    if (!file) errs.file = 'Please select a file to upload'
    return errs
  }

  function reset() {
    setName('')
    setFolder('')
    setExpiryDate('')
    setFile(null)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsSubmitting(true)
    try {
      await onUpload({
        name: name.trim(),
        folder: folder as DocumentFolder,
        expiryDate: expiryDate || null,
        file: file!,
      })
      reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset()
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Document Name */}
          <Field
            invalid={!!errors.name}
            description={errors.name}
          >
            <Label htmlFor="doc-name">Document name</Label>
            <Input
              id="doc-name"
              placeholder="e.g. Medical License — CA 2025"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
              }}
              disabled={isSubmitting}
            />
          </Field>

          {/* Folder */}
          <Field
            invalid={!!errors.folder}
            description={errors.folder}
          >
            <Label htmlFor="doc-folder">Folder</Label>
            <Select
              value={folder}
              onValueChange={(val) => {
                setFolder(val as DocumentFolder)
                if (errors.folder) setErrors((p) => ({ ...p, folder: undefined }))
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger id="doc-folder">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {FOLDERS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Expiry Date (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-expiry">
              Expiry date{' '}
              <span className="text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="doc-expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <Field
            invalid={!!errors.file}
            description={errors.file}
          >
            <Label htmlFor="doc-file">File</Label>
            <div
              className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center cursor-pointer transition-colors hover:bg-muted/50 ${
                errors.file ? 'border-destructive' : 'border-border'
              }`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
              }}
              aria-label="Click to select a file"
            >
              <input
                ref={fileInputRef}
                id="doc-file"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null
                  setFile(f)
                  if (errors.file) setErrors((p) => ({ ...p, file: undefined }))
                }}
                disabled={isSubmitting}
              />
              {file ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium text-foreground truncate max-w-[320px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    Click to browse or drag a file here
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, PNG, JPG — max 25 MB
                  </span>
                </>
              )}
            </div>
          </Field>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Upload document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
