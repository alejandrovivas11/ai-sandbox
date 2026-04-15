'use client'

import { Button } from '@/components/ui/Button'

interface BulkActionsBarProps {
  selectedCount: number
  onBulkEdit: () => void
  onBulkDelete: () => void
  onBulkExport: () => void
}

export function BulkActionsBar({
  selectedCount,
  onBulkEdit,
  onBulkDelete,
  onBulkExport,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-row items-center gap-4 bg-muted/50 px-6 py-4">
      <span className="text-sm text-neutral-900">
        {selectedCount} items selected
      </span>
      <div className="flex-1" />
      <div className="flex flex-row gap-2">
        <Button variant="secondary" size="sm" onClick={onBulkEdit}>
          Bulk Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          Bulk Delete
        </Button>
        <Button variant="secondary" size="sm" onClick={onBulkExport}>
          Bulk Export
        </Button>
      </div>
    </div>
  )
}
