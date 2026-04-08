"use client"

import { useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { PayrollData } from "@/types/payroll"

interface PayrollTableProps {
  data: PayrollData[]
}

export function PayrollTable({ data }: PayrollTableProps) {
  const columns = useMemo<ColumnDef<PayrollData>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: "Staff Member",
        cell: ({ row }) => <div className="font-medium">{row.getValue("staffName")}</div>,
      },
      {
        accessorKey: "regularHours",
        header: "Regular Hours",
        cell: ({ row }) => <div>{row.getValue("regularHours")}</div>,
      },
      {
        accessorKey: "ptoHours",
        header: "PTO Hours",
        cell: ({ row }) => <div>{row.getValue("ptoHours")}</div>,
      },
      {
        accessorKey: "adjustments",
        header: "Adjustments",
        cell: ({ row }) => (
          <div className="font-medium">${row.getValue("adjustments")}</div>
        ),
      },
      {
        accessorKey: "rate",
        header: "Rate",
        cell: ({ row }) => <div>${row.getValue("rate")}/hr</div>,
      },
      {
        accessorKey: "totalPay",
        header: "Total Pay",
        cell: ({ row }) => (
          <div className="font-semibold">${row.getValue("totalPay")}</div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No payroll data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
