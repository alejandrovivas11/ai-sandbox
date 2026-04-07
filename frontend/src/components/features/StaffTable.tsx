"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { Search, Filter, Download, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import type { StaffMember, StaffStatus } from "@/types/staff"

const statusVariant: Record<StaffStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "default",
  Onboarding: "secondary",
  Inactive: "outline",
}

const columns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const initials = `${row.original.firstName[0]}${row.original.lastName[0]}`
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={statusVariant[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div>
        <div className="text-sm">{row.original.role}</div>
        <div className="text-xs text-muted-foreground">{row.original.department}</div>
      </div>
    ),
  },
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.teams.map((team) => (
          <Badge key={team} variant="secondary" className="text-xs">
            {team}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "payrollStatus",
    header: "Payroll",
    cell: ({ row }) => {
      const ps = row.original.payrollStatus
      const variant = ps === "Enrolled" ? "default" : ps === "Pending" ? "secondary" : "outline"
      return <Badge variant={variant}>{ps}</Badge>
    },
  },
]

function exportToCsv(data: StaffMember[]) {
  const headers = ["Name", "Email", "Status", "Role", "Department", "Teams", "Payroll Status", "Start Date", "Phone"]
  const rows = data.map((s) => [
    `${s.firstName} ${s.lastName}`,
    s.email,
    s.status,
    s.role,
    s.department,
    s.teams.join("; "),
    s.payrollStatus,
    s.startDate,
    s.phone,
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "staff-export.csv"
  link.click()
  URL.revokeObjectURL(url)
}

interface StaffTableProps {
  data: StaffMember[]
}

export function StaffTable({ data }: StaffTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<Set<StaffStatus>>(new Set())
  const [roleFilter, setRoleFilter] = React.useState<Set<string>>(new Set())
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)

  const allRoles = React.useMemo(() => Array.from(new Set(data.map((s) => s.role))).sort(), [data])

  const filtered = React.useMemo(() => {
    return data.filter((s) => {
      const matchesSearch =
        search === "" ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter.size === 0 || statusFilter.has(s.status)
      const matchesRole = roleFilter.size === 0 || roleFilter.has(s.role)
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [data, search, statusFilter, roleFilter])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice(page * pageSize, (page + 1) * pageSize)

  React.useEffect(() => {
    setPage(0)
  }, [search, statusFilter, roleFilter, pageSize])

  const toggleStatus = (status: StaffStatus) => {
    setStatusFilter((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const toggleRole = (role: string) => {
    setRoleFilter((prev) => {
      const next = new Set(prev)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(statusFilter.size > 0 || roleFilter.size > 0) && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusFilter.size + roleFilter.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {(["Active", "Onboarding", "Inactive"] as StaffStatus[]).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.has(status)}
                  onCheckedChange={() => toggleStatus(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              {allRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={roleFilter.has(role)}
                  onCheckedChange={() => toggleRole(role)}
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToCsv(filtered)}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={paginatedData} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1} to{" "}
          {Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length} staff members
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
