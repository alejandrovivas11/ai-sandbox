import { PayrollData, PayrollPeriod, PayrollStatistics } from "@/types/payroll"

export const payrollPeriods: PayrollPeriod[] = [
  {
    id: "period-1",
    label: "November 11 - November 24, 2025",
    startDate: "2025-11-11",
    endDate: "2025-11-24",
  },
  {
    id: "period-2",
    label: "November 25 - December 8, 2025",
    startDate: "2025-11-25",
    endDate: "2025-12-08",
  },
  {
    id: "period-3",
    label: "December 9 - December 22, 2025",
    startDate: "2025-12-09",
    endDate: "2025-12-22",
  },
]

export const payrollData: PayrollData[] = [
  {
    id: "payroll-1",
    staffMemberId: "staff-1",
    staffName: "Sarah Johnson",
    regularHours: 80,
    ptoHours: 4,
    adjustments: 150,
    rate: 45,
    totalPay: 3750,
  },
  {
    id: "payroll-2",
    staffMemberId: "staff-2",
    staffName: "Mike Chen",
    regularHours: 75,
    ptoHours: 8,
    adjustments: 200,
    rate: 52,
    totalPay: 4104,
  },
  {
    id: "payroll-3",
    staffMemberId: "staff-3",
    staffName: "Jessica Martinez",
    regularHours: 80,
    ptoHours: 0,
    adjustments: 100,
    rate: 48,
    totalPay: 3940,
  },
  {
    id: "payroll-4",
    staffMemberId: "staff-4",
    staffName: "David Park",
    regularHours: 78,
    ptoHours: 6,
    adjustments: 175,
    rate: 50,
    totalPay: 4025,
  },
]

export function getPayrollStatistics(
  data: PayrollData[]
): PayrollStatistics {
  const totalHours = data.reduce(
    (sum, item) => sum + item.regularHours + item.ptoHours,
    0
  )
  const totalAdjustments = data.reduce((sum, item) => sum + item.adjustments, 0)
  const averagePay =
    data.length > 0
      ? Math.round(data.reduce((sum, item) => sum + item.totalPay, 0) / data.length)
      : 0

  return {
    totalHours,
    totalAdjustments,
    averagePay,
  }
}
