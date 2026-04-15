'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import {
  Card,
  CardContent,
} from '@/components/ui/Card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { MoveTargetsTable } from '@/components/features/move-targets/MoveTargetsTable'
import { useMoveTargets } from '@/hooks/useMoveTargets'
import { useTargetSelection } from '@/hooks/useTargetSelection'

export default function MoveTargetsPage() {
  const {
    targets,
    patient,
    programs,
    destinationValue,
    setDestinationValue,
    isLoading,
  } = useMoveTargets()

  const {
    selectedIds,
    toggleSelection,
    toggleAll,
    hasSelection,
  } = useTargetSelection()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  // Build destination options from programs and their phases
  const destinationOptions: { value: string; label: string }[] = []
  programs.forEach((program) => {
    program.phases.forEach((phase) => {
      destinationOptions.push({
        value: `${program.id}-${phase.id}`,
        label: `${program.name} - ${phase.name}`,
      })
    })
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* render_sequence[0]: Header with breadcrumb and title */}
      <header className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/bulk-selection">Bulk Selection</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Move Targets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-neutral-900">Move Targets</h1>
      </header>

      {/* render_sequence[1]: Patient information card */}
      <Card className="bg-white border border-border rounded-lg shadow-sm">
        <CardContent className="flex flex-col gap-1 p-5">
          <span className="text-sm font-medium text-gray-500">Patient:</span>
          <span className="text-sm text-gray-900">{patient?.name}</span>
        </CardContent>
      </Card>

      {/* render_sequence[2]: Current location card */}
      <Card className="bg-white border border-border rounded-lg shadow-sm">
        <CardContent className="flex flex-col gap-1 p-5">
          <span className="text-sm font-medium text-gray-500">Current Location:</span>
          <span className="text-sm text-gray-900">{patient?.currentLocation}</span>
        </CardContent>
      </Card>

      {/* render_sequence[3]: Targets selection table card */}
      <Card className="bg-white border border-border rounded-lg shadow-sm">
        <CardContent className="p-0">
          <MoveTargetsTable
            targets={targets}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
          />
        </CardContent>
      </Card>

      {/* render_sequence[4]: Form section for destination selection */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Move to:</Label>
          <Select
            value={destinationValue}
            onValueChange={setDestinationValue}
          >
            <SelectTrigger className="w-full max-w-md bg-white">
              <SelectValue placeholder="Select destination program/phase" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {destinationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* render_sequence[5]: Action buttons */}
      <div className="flex flex-row gap-2">
        <Link href="/bulk-selection">
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Button
          variant="default"
          disabled={!hasSelection}
        >
          Move Targets
        </Button>
      </div>
    </div>
  )
}
