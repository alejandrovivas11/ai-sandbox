/**
 * Mock payroll data for dashboard display
 */

import type { PayrollRecord, PayrollPeriod, PayrollStatistics } from '@/types/payroll'

export const payrollPeriods: PayrollPeriod[] = [
  {
    id: 'period-1',
    label: 'November 11 - November 24, 2025',
    startDate: '2025-11-11',
    endDate: '2025-11-24',
  },
  {
    id: 'period-2',
    label: 'October 28 - November 10, 2025',
    startDate: '2025-10-28',
    endDate: '2025-11-10',
  },
  {
    id: 'period-3',
    label: 'October 14 - October 27, 2025',
    startDate: '2025-10-14',
    endDate: '2025-10-27',
  },
]

export const payrollRecords: PayrollRecord[] = [
  {
    id: 'staff-1',
    staffMember: 'Sarah Johnson',
    regularHours: 80,
    ptoHours: 8,
    adjustments: 50,
    rate: 45,
    totalPay: 3890,
  },
  {
    id: 'staff-2',
    staffMember: 'Mike Chen',
    regularHours: 80,
    ptoHours: 0,
    adjustments: 120,
    rate: 52,
    totalPay: 4280,
  },
  {
    id: 'staff-3',
    staffMember: 'Jessica Martinez',
    regularHours: 72,
    ptoHours: 8,
    adjustments: 75,
    rate: 48,
    totalPay: 3795,
  },
  {
    id: 'staff-4',
    staffMember: 'David Park',
    regularHours: 80,
    ptoHours: 4,
    adjustments: 100,
    rate: 50,
    totalPay: 4250,
  },
]

export function getPayrollStatistics(records: PayrollRecord[]): PayrollStatistics {
  const totalHours = records.reduce((sum, record) => sum + record.regularHours + record.ptoHours, 0)
  const totalAdjustments = records.reduce((sum, record) => sum + record.adjustments, 0)
  const averagePay = records.length > 0 ? records.reduce((sum, record) => sum + record.totalPay, 0) / records.length : 0

  return {
    totalHours,
    totalAdjustments,
    averagePay: Math.round(averagePay * 100) / 100,
    trend: 3.2,
  }
}
