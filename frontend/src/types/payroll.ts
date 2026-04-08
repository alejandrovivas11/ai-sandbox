export interface PayrollData {
  id: string
  staffMemberId: string
  staffName: string
  regularHours: number
  ptoHours: number
  adjustments: number
  rate: number
  totalPay: number
}

export interface PayrollPeriod {
  id: string
  label: string
  startDate: string
  endDate: string
}

export interface PayrollStatistics {
  totalHours: number
  totalAdjustments: number
  averagePay: number
}
