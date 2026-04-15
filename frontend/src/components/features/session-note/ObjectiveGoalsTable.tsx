"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { CUEING_LEVEL_OPTIONS } from "@/lib/constants/slp-options"
import type { ObjectiveGoal } from "@/types/session-note"

interface ObjectiveGoalsTableProps {
  goals: ObjectiveGoal[]
  onUpdateGoal: (index: number, field: keyof ObjectiveGoal, value: string) => void
}

export function ObjectiveGoalsTable({ goals, onUpdateGoal }: ObjectiveGoalsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-xs font-medium text-gray-500">Goal Target</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Accuracy %</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Cueing Level</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Trials</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {goals.map((goal, index) => (
          <TableRow key={index} className="border-b border-gray-100 h-10">
            <TableCell className="text-sm text-gray-700">{goal.goalTarget}</TableCell>
            <TableCell className="text-sm text-gray-700">{goal.accuracyPercent}</TableCell>
            <TableCell>
              <Select
                value={goal.cueingLevel}
                onValueChange={(v) => onUpdateGoal(index, "cueingLevel", v)}
              >
                <SelectTrigger className="bg-white border border-gray-200 h-8 text-sm w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {CUEING_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-sm text-gray-700">{goal.trials}</TableCell>
            <TableCell className="text-sm text-gray-700">{goal.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
