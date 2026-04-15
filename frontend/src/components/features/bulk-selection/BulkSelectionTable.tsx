'use client'

import { Target } from '@/types/targets'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Card,
  CardContent,
} from '@/components/ui/Card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Active':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Active
        </Badge>
      )
    case 'Completed':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Completed
        </Badge>
      )
    case 'In Progress':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          In Progress
        </Badge>
      )
    case 'Failed':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Failed
        </Badge>
      )
    case 'Scheduled':
      return <Badge variant="secondary">Scheduled</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

interface BulkSelectionTableProps {
  targets: Target[]
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onToggleAll: () => void
}

export function BulkSelectionTable({
  targets,
  selectedIds,
  onToggleSelection,
  onToggleAll,
}: BulkSelectionTableProps) {
  const allSelected =
    targets.length > 0 && targets.every((t) => selectedIds.has(t.id))

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onToggleAll()}
                />
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Name
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Progress
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Category
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Author
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((target) => (
              <TableRow
                key={target.id}
                className="border-b border-gray-100"
              >
                <TableCell className="w-10">
                  <Checkbox
                    checked={selectedIds.has(target.id)}
                    onCheckedChange={() => onToggleSelection(target.id)}
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {target.name}
                </TableCell>
                <TableCell>
                  <StatusBadge status={target.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {target.progress}%
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {target.category}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {target.author}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {target.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
