"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import type { GoalProgress } from "@/types/session-note"

interface GoalProgressTableProps {
  goals: GoalProgress[]
}

function ProgressBadge({ status }: { status: GoalProgress["progressStatus"] }) {
  switch (status) {
    case "Progressing":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Progressing
        </Badge>
      )
    case "Mastered":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Mastered
        </Badge>
      )
    case "Minimal Progress":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Minimal Progress
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

export function GoalProgressTable({ goals }: GoalProgressTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-xs font-medium text-gray-500">
              Goal Description
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              % Accuracy
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Cueing Level
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Trials
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Progress
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow key={goal.id} className="border-b border-gray-100 h-10">
              <TableCell className="text-sm text-gray-700">
                {goal.goalDescription}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {goal.accuracyPercent}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {goal.cueingLevel}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {goal.trials}
              </TableCell>
              <TableCell>
                <ProgressBadge status={goal.progressStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
