'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DataTable,
  H1,
  P,
} from '@/components/ui'
import { StatisticCard } from '@/components/blocks'
import { Download, Send, Lock, Clock, DollarSign, TrendingUp } from 'lucide-react'
import type { PayrollRecord } from '@/types/payroll'
import { payrollPeriods, payrollRecords, getPayrollStatistics } from '@/data/mockPayroll'

const columns: ColumnDef<PayrollRecord>[] = [
  {
    accessorKey: 'staffMember',
    header: 'Staff Member',
    cell: ({ row }) => <span className="font-medium">{row.getValue('staffMember')}</span>,
  },
  {
    accessorKey: 'regularHours',
    header: 'Regular Hours',
    cell: ({ row }) => <span>{row.getValue('regularHours')} hrs</span>,
  },
  {
    accessorKey: 'ptoHours',
    header: 'PTO Hours',
    cell: ({ row }) => <span>{row.getValue('ptoHours')} hrs</span>,
  },
  {
    accessorKey: 'adjustments',
    header: 'Adjustments',
    cell: ({ row }) => <span className="text-amber-600">${row.getValue('adjustments')}</span>,
  },
  {
    accessorKey: 'rate',
    header: 'Rate',
    cell: ({ row }) => <span>${row.getValue('rate')}/hr</span>,
  },
  {
    accessorKey: 'totalPay',
    header: 'Total Pay',
    cell: ({ row }) => <span className="font-semibold text-green-600">${row.getValue('totalPay')}</span>,
  },
]

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(payrollPeriods[0].id)
  const statistics = getPayrollStatistics(payrollRecords)

  const handleApproveAndLock = () => {
    console.log('Approve and Lock Payroll clicked')
  }

  const handleExportCSV = () => {
    console.log('Export CSV clicked')
  }

  const handleSendToProvider = () => {
    console.log('Send to Provider clicked')
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-background p-6">
      {/* Header */}
      <div>
        <H1>Payroll Dashboard</H1>
        <P className="text-muted-foreground">Manage payroll periods, review staff payments, and export data</P>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatisticCard
          header="Total Hours"
          value={`${statistics.totalHours} hrs`}
          showInfo
          icon={<Clock className="h-4 w-4" />}
        />
        <StatisticCard
          header="Total Adjustments"
          value={`$${statistics.totalAdjustments}`}
          showInfo
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatisticCard
          header="Average Pay"
          value={`$${statistics.averagePay.toFixed(2)}`}
          showInfo
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Payroll Data Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Staff Payment Data</CardTitle>
            <CardDescription>Review and manage payroll for the selected period</CardDescription>
          </div>
          <Badge variant="outline">Pending Approval</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Payroll Period:</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {payrollPeriods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={payrollRecords} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 border-t pt-6">
            <Button onClick={handleApproveAndLock} className="gap-2">
              <Lock className="h-4 w-4" />
              Approve & Lock Payroll
            </Button>
            <Button onClick={handleExportCSV} variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={handleSendToProvider} variant="secondary" className="gap-2">
              <Send className="h-4 w-4" />
              Send to Provider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
