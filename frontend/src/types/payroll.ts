/**
 * Payroll data type definitions
 */

export interface PayrollPeriod {
  id: string
  label: string
  startDate: string
  endDate: string
}

export interface PayrollRecord {
  id: string
  staffMember: string
  regularHours: number
  ptoHours: number
  adjustments: number
  rate: number
  totalPay: number
}

export interface PayrollStatistics {
  totalHours: number
  totalAdjustments: number
  averagePay: number
  trend: number
}
