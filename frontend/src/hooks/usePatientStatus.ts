'use client'

import { useState, useCallback } from 'react'

export interface StatusOption {
  value: string
  label: string
}

export const statusOptions: StatusOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

export function usePatientStatus() {
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedStatus) return
    // In a real app, this would call an API
    console.log('Status changed to:', selectedStatus)
  }, [selectedStatus])

  const isValid = selectedStatus !== ''

  return {
    selectedStatus,
    handleStatusChange,
    handleConfirm,
    isValid,
    statusOptions,
  }
}
