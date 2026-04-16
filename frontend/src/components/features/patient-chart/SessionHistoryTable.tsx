"use client"

import { Badge } from "@/components/ui/Badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table"
import type { Session } from "@/types/patient-chart"

interface SessionHistoryTableProps {
  sessions: Session[]
}

function getNoteStatusBadge(status: string) {
  if (status === "Signed") {
    return (
      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
        {status}
      </Badge>
    )
  }
  if (status === "Pending Co-signature") {
    return (
      <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        {status}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary">
      {status}
    </Badge>
  )
}

export function SessionHistoryTable({ sessions }: SessionHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-xs font-medium text-gray-500">Date</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Type</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">CPT Code</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Provider</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Duration</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Note Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id} className="h-10 border-b border-gray-100">
            <TableCell className="text-sm text-gray-700">{session.date}</TableCell>
            <TableCell className="text-sm text-gray-700">{session.type}</TableCell>
            <TableCell className="text-sm text-gray-700">{session.cptCode}</TableCell>
            <TableCell className="text-sm text-gray-700">{session.providerName}</TableCell>
            <TableCell className="text-sm text-gray-700">{session.duration}</TableCell>
            <TableCell>{getNoteStatusBadge(session.noteStatus)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
