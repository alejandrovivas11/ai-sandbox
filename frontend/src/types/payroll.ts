export type PayrollPeriod = {
  id: string
  label: string
  startDate: string
  endDate: string
}

export type PayrollData = {
  id: string
  staffMemberId: string
  staffName: string
  regularHours: number
  ptoHours: number
  adjustments: number
  rate: number
  totalPay: number
}

export type PayrollStatistics = {
  totalHours: number
  totalAdjustments: number
  averagePay: number
}
