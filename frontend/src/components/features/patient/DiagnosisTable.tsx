import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import type { Diagnosis } from "@/types/patient-detail"

interface DiagnosisTableProps {
  diagnoses: Diagnosis[]
}

export function DiagnosisTable({ diagnoses }: DiagnosisTableProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Active Diagnoses</h2>
          <Button variant="secondary" size="sm">+ Add Diagnosis</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500">ICD-10 Code</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Description</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Date Diagnosed</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.map((dx) => (
              <TableRow key={dx.icdCode} className="border-b border-gray-100">
                <TableCell className="text-sm text-gray-700">{dx.icdCode}</TableCell>
                <TableCell className="text-sm text-gray-700">{dx.description}</TableCell>
                <TableCell className="text-sm text-gray-700">{dx.diagnosedDate}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{dx.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
