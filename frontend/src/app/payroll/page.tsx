"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { H2, P, Small } from "@/components/ui/Typography"
import { PayrollTable } from "@/components/features/PayrollTable"
import { payrollData, payrollPeriods, getPayrollStatistics } from "@/data/mockPayroll"
import { formatCurrency } from "@/lib/utils"

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0].id)
  const statistics = getPayrollStatistics(payrollData)

  const currentPeriod = payrollPeriods.find((p) => p.id === selectedPeriod)

  return (
    <main className="p-6">
      <div className="mb-8">
        <H2>Payroll Management</H2>
        <P className="text-muted-foreground mt-2">
          Manage and process payroll for your staff members
        </P>
      </div>

      <div className="mb-6">
        <Badge variant="secondary">Pending Approval</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.totalHours}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Small className="text-muted-foreground">
                +5% from last period
              </Small>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Total Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(statistics.totalAdjustments)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Small className="text-muted-foreground">
                +2% from last period
              </Small>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Average Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(statistics.averagePay)}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Small className="text-muted-foreground">
                +3% from last period
              </Small>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Pay Period</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-96">
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
          {currentPeriod && (
            <Small className="text-muted-foreground mt-3">
              Selected: {currentPeriod.startDate} to {currentPeriod.endDate}
            </Small>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Staff Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <PayrollTable data={payrollData} />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button>Approve & Lock Payroll</Button>
        <Button variant="secondary">Export CSV</Button>
        <Button variant="outline">Send to Provider</Button>
      </div>
    </main>
  )
}
