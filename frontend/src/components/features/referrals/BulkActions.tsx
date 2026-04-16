"use client"

import { Button } from "@/components/ui/Button"
import { Muted } from "@/components/ui/Typography"

interface BulkActionsProps {
  selectedCount: number
  onBulkAssign: () => void
  onBulkTriage: () => void
  onBulkArchive: () => void
}

export function BulkActions({
  selectedCount,
  onBulkAssign,
  onBulkTriage,
  onBulkArchive,
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-row items-center gap-2 px-6 pb-4">
      <Muted className="text-sm">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </Muted>
      <Button variant="secondary" size="sm" onClick={onBulkAssign}>
        Bulk Assign Therapist
      </Button>
      <Button variant="secondary" size="sm" onClick={onBulkTriage}>
        Bulk Change Triage Tier
      </Button>
      <Button variant="destructive" size="sm" onClick={onBulkArchive}>
        Bulk Archive
      </Button>
    </div>
  )
}
