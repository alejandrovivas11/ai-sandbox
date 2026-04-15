'use client'

import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { useClientStatus } from '@/hooks/useClientStatus'
import type { ClientStatus } from '@/types/client'
const STATUS_OPTIONS: {
  value: ClientStatus
  label: string
  badgeClass: string
}[] = [
  { value: 'Active', label: 'Active', badgeClass: 'bg-green-100 text-green-700' },
  { value: 'On Hold', label: 'On Hold', badgeClass: 'bg-yellow-100 text-yellow-700' },
  { value: 'Pending', label: 'Pending', badgeClass: 'bg-neutral-100 text-neutral-700' },
  { value: 'Discharged', label: 'Discharged', badgeClass: 'bg-gray-100 text-gray-500' },
  { value: 'Inactive', label: 'Inactive', badgeClass: 'bg-red-100 text-red-700' },
]

export function ChangeStatusModal() {
  const router = useRouter()
  const {
    selectedStatus,
    handleStatusSelect,
    handleConfirm,
    isValid,
  } = useClientStatus('Active')

  const handleClose = () => {
    router.push('/bulk-selection')
  }

  const handleCancel = () => {
    router.push('/bulk-selection')
  }

  const handleConfirmClick = () => {
    if (!isValid) return
    handleConfirm()
    router.push('/bulk-selection')
  }

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md flex flex-col">
        {/* render_sequence[0]: header */}
        <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-neutral-900">Change Status</h3>
          <Button variant="ghost" size="icon-sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* render_sequence[1]: main content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Client header: avatar + name side by side */}
          <div className="flex flex-row items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>SG</AvatarFallback>
            </Avatar>
            <h4 className="text-base font-semibold text-neutral-900">Samantha Green</h4>
          </div>

          {/* Current status */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Current Status</span>
            <div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
          </div>

          {/* Status selection */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-muted-foreground">Select New Status</span>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full flex flex-row items-center justify-start px-4 py-3 border rounded-md text-left transition-colors hover:bg-muted ${
                    selectedStatus === option.value
                      ? 'border-foreground bg-muted'
                      : 'border-border bg-background'
                  }`}
                >
                  <Badge variant="default" className={option.badgeClass}>
                    {option.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* render_sequence[2]: actions */}
        <div className="flex flex-row items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleConfirmClick} disabled={!isValid}>
            <Check className="w-4 h-4 mr-1.5" />
            Confirm Status Change
          </Button>
        </div>
      </div>
    </div>
  )
}
