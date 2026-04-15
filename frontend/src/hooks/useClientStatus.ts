'use client'

import { useState, useCallback } from 'react'
import type { ClientStatus } from '@/types/client'

export function useClientStatus(currentStatus: ClientStatus) {
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | null>(null)

  const handleStatusSelect = useCallback((status: ClientStatus) => {
    setSelectedStatus(status)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedStatus) return
    console.log('Status changed to:', selectedStatus)
  }, [selectedStatus])

  const isValid = selectedStatus !== null && selectedStatus !== currentStatus

  return {
    selectedStatus,
    handleStatusSelect,
    handleConfirm,
    isValid,
  }
}
