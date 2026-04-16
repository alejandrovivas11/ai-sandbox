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
import type { Caregiver } from "@/types/patient-detail"

interface CaregiverTableProps {
  caregivers: Caregiver[]
}

export function CaregiverTable({ caregivers }: CaregiverTableProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Caregiver Information</h2>
          <Button variant="secondary" size="sm">+ Add Caregiver</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500">Name</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Relationship</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Phone</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Preferred Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caregivers.map((c) => (
              <TableRow key={c.name} className="border-b border-gray-100">
                <TableCell className="text-sm text-gray-700">{c.name}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.relationship}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.phone}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.preferredLanguage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
