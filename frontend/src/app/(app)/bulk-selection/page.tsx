'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
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
import { BulkActionsBar } from '@/components/features/bulk-selection/BulkActionsBar'
import { useBulkSelection } from '@/hooks/useBulkSelection'

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          Active
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
          Pending
        </span>
      )
    case 'inactive':
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          Inactive
        </span>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function BulkSelectionPage() {
  const {
    records,
    filters,
    setSearch,
    setStatus,
    selectedIds,
    toggleSelection,
    toggleAll,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
  } = useBulkSelection()

  const totalPages = Math.max(1, Math.ceil(totalCount / 5))
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * 5 + 1
  const endItem = Math.min(currentPage * 5, totalCount)
  const allSelected = records.length > 0 && selectedIds.size === records.length

  return (
    <div className="flex flex-col gap-6">
      {/* render_sequence[0]: Header with breadcrumb and title */}
      <header className="flex flex-row items-center gap-4 px-6 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bulk Selection</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-neutral-900">Bulk Selection</h1>
      </header>

      {/* render_sequence[1]: Search and filter controls */}
      <div className="flex flex-row items-center gap-4 px-6">
        <div className="w-[300px]">
          <Input
            placeholder="Search records..."
            leadingIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => setStatus(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* render_sequence[2]: Card with data table */}
      <div className="px-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="w-10">
                    <Checkbox
                      id="select-all"
                      checked={allSelected}
                      onCheckedChange={() => toggleAll()}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Assignee
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-b border-gray-100"
                  >
                    <TableCell className="w-10">
                      <Checkbox
                        id={`select-${record.id}`}
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleSelection(record.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {record.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {record.date}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {record.type}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {record.assignee}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* render_sequence[3]: Conditional bulk actions bar */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        onBulkEdit={() => console.log('Bulk edit', Array.from(selectedIds))}
        onBulkDelete={() => console.log('Bulk delete', Array.from(selectedIds))}
        onBulkExport={() => console.log('Bulk export', Array.from(selectedIds))}
      />

      {/* render_sequence[4]: Pagination controls */}
      <div className="flex flex-row items-center justify-between px-6 pb-6">
        <span className="text-xs text-muted-foreground">
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
                variant={page === currentPage ? 'default' : 'ghost'}
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
    </div>
  )
}
