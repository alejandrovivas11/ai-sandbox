import type { ColumnDef, SortingState, VisibilityState } from '@tanstack/react-table'

export interface DataTablePaginationConfig {
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: DataTablePaginationConfig
  filterPlaceholder?: string
  filterColumn?: string
  className?: string
}
