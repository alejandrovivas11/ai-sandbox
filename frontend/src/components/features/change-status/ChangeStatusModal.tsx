'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { usePatientStatus } from '@/hooks/usePatientStatus'

export function ChangeStatusModal() {
  const router = useRouter()
  const {
    selectedStatus,
    handleStatusChange,
    handleConfirm,
    isValid,
    statusOptions,
  } = usePatientStatus()

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md flex flex-col">
        {/* Header - render_sequence index 0 */}
        <div className="flex flex-row items-center justify-between bg-white px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-neutral-900">Change Status</h3>
          <Button variant="ghost" size="icon-sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content - render_sequence index 1 */}
        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Patient group */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">Patient</label>
            <p className="text-sm font-medium text-neutral-900">Samantha Green</p>
          </div>

          {/* Current Status group */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">Current Status</label>
            <div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
          </div>

          {/* New Status form_section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              New Status <span className="text-red-500">*</span>
            </label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions - render_sequence index 2 */}
        <div className="flex flex-row items-center justify-end gap-3 bg-white px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleConfirmClick} disabled={!isValid}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
