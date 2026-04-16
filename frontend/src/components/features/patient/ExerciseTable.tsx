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
import type { Exercise } from "@/types/patient-detail"

interface ExerciseTableProps {
  exercises: Exercise[]
}

function complianceBadgeClass(compliance: string) {
  const value = parseInt(compliance, 10)
  if (value >= 80) return "bg-green-100 text-green-700 hover:bg-green-100"
  if (value >= 50) return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
  return "bg-red-100 text-red-700 hover:bg-red-100"
}

export function ExerciseTable({ exercises }: ExerciseTableProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Home Exercise Program</h2>
          <div className="flex flex-row gap-2">
            <Button variant="secondary" size="sm">Print HEP</Button>
            <Button variant="secondary" size="sm">Assign Exercise</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500">Exercise</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Frequency</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Compliance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((ex) => (
              <TableRow key={ex.name} className="border-b border-gray-100">
                <TableCell className="text-sm text-gray-700">{ex.name}</TableCell>
                <TableCell className="text-sm text-gray-700">{ex.frequency}</TableCell>
                <TableCell>
                  <Badge className={complianceBadgeClass(ex.compliance)}>{ex.compliance}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
