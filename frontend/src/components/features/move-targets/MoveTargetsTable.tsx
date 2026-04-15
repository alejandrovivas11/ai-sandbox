'use client'

import { Checkbox } from '@/components/ui/Checkbox'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { Target, TargetStatus } from '@/types/targets'

function StatusBadge({ status }: { status: TargetStatus }) {
  switch (status) {
    case 'Active':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          Active
        </span>
      )
    case 'In Progress':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
          In Progress
        </span>
      )
    case 'On Hold':
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
          On Hold
        </span>
      )
    default:
      return null
  }
}

interface MoveTargetsTableProps {
  targets: Target[]
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onToggleAll: (allIds: string[]) => void
}

export function MoveTargetsTable({
  targets,
  selectedIds,
  onToggleSelection,
  onToggleAll,
}: MoveTargetsTableProps) {
  const allSelected = targets.length > 0 && selectedIds.size === targets.length
  const allIds = targets.map((t) => t.id)

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="w-10 text-xs font-medium text-gray-500">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => onToggleAll(allIds)}
            />
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Target Name
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Program
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {targets.map((target) => (
          <TableRow key={target.id} className="border-b border-gray-100 h-10">
            <TableCell className="w-10">
              <Checkbox
                checked={selectedIds.has(target.id)}
                onCheckedChange={() => onToggleSelection(target.id)}
              />
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {target.name}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {target.program}
            </TableCell>
            <TableCell>
              <StatusBadge status={target.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
