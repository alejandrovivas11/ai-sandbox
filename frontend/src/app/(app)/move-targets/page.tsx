"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { MoveTargetsForm } from "@/components/features/move-targets/MoveTargetsForm"
import { useMoveTargets } from "@/hooks/useMoveTargets"

export default function MoveTargetsPage() {
  const {
    client,
    sourcePrograms,
    destinationPrograms,
    targets,
    sourceValue,
    setSourceValue,
    destinationValue,
    setDestinationValue,
    selectedTargetIds,
    toggleTarget,
    isLoading,
    canMove,
  } = useMoveTargets()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* render_sequence[0]: Header with breadcrumb and client name */}
      <header className="flex flex-row items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{client?.organizationName ?? "ABC Corporation"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/bulk-selection">Actions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Move Targets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <span className="text-lg font-semibold text-neutral-900">
          {client?.name ?? "ABC Corporation"}
        </span>
      </header>

      {/* render_sequence[1]: Main form card */}
      <MoveTargetsForm
        sourcePrograms={sourcePrograms}
        destinationPrograms={destinationPrograms}
        targets={targets}
        sourceValue={sourceValue}
        onSourceChange={setSourceValue}
        destinationValue={destinationValue}
        onDestinationChange={setDestinationValue}
        selectedTargetIds={selectedTargetIds}
        onToggleTarget={toggleTarget}
        canMove={canMove}
      />
    </div>
  )
}
