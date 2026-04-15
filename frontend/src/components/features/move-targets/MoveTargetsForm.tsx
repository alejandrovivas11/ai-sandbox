"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Card, CardContent } from "@/components/ui/Card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { TargetRow } from "@/components/features/move-targets/TargetRow"
import type { Target, Program } from "@/types/move-targets"

interface MoveTargetsFormProps {
  sourcePrograms: Program[]
  destinationPrograms: Program[]
  targets: Target[]
  sourceValue: string
  onSourceChange: (value: string) => void
  destinationValue: string
  onDestinationChange: (value: string) => void
  selectedTargetIds: Set<string>
  onToggleTarget: (id: string) => void
  canMove: boolean
}

export function MoveTargetsForm({
  sourcePrograms,
  destinationPrograms,
  targets,
  sourceValue,
  onSourceChange,
  destinationValue,
  onDestinationChange,
  selectedTargetIds,
  onToggleTarget,
  canMove,
}: MoveTargetsFormProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        {/* Card title */}
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Move Targets
        </h2>

        {/* form_field: Source Program */}
        <div className="flex flex-col gap-2">
          <Label className="text-neutral-900">Source Program</Label>
          <Select value={sourceValue} onValueChange={onSourceChange}>
            <SelectTrigger className="bg-white border border-[#E5E5E5]">
              <SelectValue placeholder="Select source program" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sourcePrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* form_field: Select Targets to Move */}
        <div className="flex flex-col gap-2 mt-4">
          <Label className="text-neutral-900">Select Targets to Move</Label>
          <div className="flex flex-col gap-2 border rounded-md p-3">
            {targets.map((target) => (
              <TargetRow
                key={target.id}
                id={target.id}
                description={target.description}
                status={target.status}
                category={target.category}
                selected={selectedTargetIds.has(target.id)}
                onToggle={onToggleTarget}
              />
            ))}
          </div>
        </div>

        {/* form_field: Destination Program */}
        <div className="flex flex-col gap-2 mt-4">
          <Label className="text-neutral-900">Destination Program</Label>
          <Select value={destinationValue} onValueChange={onDestinationChange}>
            <SelectTrigger className="bg-white border border-[#E5E5E5]">
              <SelectValue placeholder="Select destination program" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {destinationPrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* actions */}
        <div className="flex flex-row justify-end gap-3 mt-6">
          <Link href="/bulk-selection">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button disabled={!canMove}>Move Targets</Button>
        </div>
      </CardContent>
    </Card>
  )
}
