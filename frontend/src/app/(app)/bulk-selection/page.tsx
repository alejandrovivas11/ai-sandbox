'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
import { BulkSelectionTable } from '@/components/features/bulk-selection/BulkSelectionTable'
import { BulkActionsBar } from '@/components/features/bulk-selection/BulkActionsBar'
import { useBulkSelection } from '@/hooks/useBulkSelection'

export default function BulkSelectionPage() {
  const {
    targets,
    filters,
    setSearch,
    setStatus,
    setCategory,
    selectedIds,
    toggleSelection,
    toggleAll,
    totalCount,
    currentPage,
    setCurrentPage,
  } = useBulkSelection()

  const totalPages = Math.max(1, Math.ceil(totalCount / 5))
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * 5 + 1
  const endItem = Math.min(currentPage * 5, totalCount)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* render_sequence[0]: Header with breadcrumb and title */}
      <header className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Actions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bulk Selection</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-neutral-900">
            Bulk Selection
          </h1>
        </div>
      </header>

      {/* render_sequence[1]: Filter controls with search and dropdowns */}
      <div className="flex flex-row items-center gap-4">
        <div className="w-[300px]">
          <Input
            placeholder="Search targets..."
            leadingIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filters.status || '__all__'}
          onValueChange={(v) => setStatus(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="__all__">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category || '__all__'}
          onValueChange={(v) => setCategory(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-[180px] bg-white border border-[#E5E5E5]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="__all__">All Categories</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="Application">Application</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Privacy">Privacy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* render_sequence[2]: Main data table */}
      <BulkSelectionTable
        targets={targets}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        onToggleAll={toggleAll}
      />

      {/* render_sequence[3]: Pagination controls */}
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-neutral-500">
          Showing {startItem}-{endItem} of {totalCount} results
        </span>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* render_sequence[4]: Conditional bulk actions bar */}
      <BulkActionsBar selectedCount={selectedIds.size} />
    </div>
  )
}
