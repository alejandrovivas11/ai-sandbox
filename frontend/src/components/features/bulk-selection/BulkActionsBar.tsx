'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface BulkActionsBarProps {
  selectedCount: number
}

export function BulkActionsBar({ selectedCount }: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-x-0 border-b-0 bg-white shadow-lg">
      <div className="flex flex-row items-center justify-between px-6 py-4">
        <span className="text-sm text-neutral-900">
          {selectedCount} items selected
        </span>
        <div className="flex flex-row gap-2">
          <Button asChild>
            <Link href="/actions/change-status">Change Status</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/actions/move-targets">Move Targets</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
