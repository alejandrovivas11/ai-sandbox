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
import type { Assessment } from "@/types/patient-detail"

interface AssessmentTableProps {
  assessments: Assessment[]
}

function severityBadgeClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "moderate":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "severe":
      return "bg-red-100 text-red-700 hover:bg-red-100"
    case "mild":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Assessment Summary</h2>
          <Button variant="secondary" size="sm">+ Add Assessment</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500">Instrument</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Standard Score</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Percentile</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((a) => (
              <TableRow key={`${a.instrument}-${a.date}`} className="border-b border-gray-100">
                <TableCell className="text-sm text-gray-700">{a.instrument}</TableCell>
                <TableCell className="text-sm text-gray-700">{a.date}</TableCell>
                <TableCell className="text-sm text-gray-700">{a.standardScore}</TableCell>
                <TableCell className="text-sm text-gray-700">{a.percentile}</TableCell>
                <TableCell>
                  <Badge className={severityBadgeClass(a.severity)}>{a.severity}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
