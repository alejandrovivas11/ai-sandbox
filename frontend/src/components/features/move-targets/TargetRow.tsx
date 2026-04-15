"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Square, CheckSquare } from "lucide-react"
import type { TargetStatus, TargetCategory } from "@/types/move-targets"

function statusVariant(status: TargetStatus) {
  switch (status) {
    case "Active":
    case "Completed":
      return "default" as const
    case "In Progress":
      return "default" as const
    case "Draft":
      return "secondary" as const
  }
}

function statusClasses(status: TargetStatus) {
  switch (status) {
    case "Active":
    case "Completed":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "In Progress":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "Draft":
      return "bg-gray-100 text-gray-500 hover:bg-gray-100"
  }
}

interface TargetRowProps {
  id: string
  description: string
  status: TargetStatus
  category: TargetCategory
  selected: boolean
  onToggle: (id: string) => void
}

export function TargetRow({
  id,
  description,
  status,
  category,
  selected,
  onToggle,
}: TargetRowProps) {
  return (
    <div className="flex flex-row items-center gap-3 p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(id)}
        className="h-8 w-8 p-0"
      >
        {selected ? (
          <CheckSquare className="h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm text-neutral-900">{description}</span>
      <Badge variant={statusVariant(status)} className={statusClasses(status)}>
        {status}
      </Badge>
      <Badge variant="secondary">{category}</Badge>
    </div>
  )
}
