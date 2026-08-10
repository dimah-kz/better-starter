"use client"

import * as React from "react"
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import {
  dataTableFeatures,
  type DataTableColumnMeta,
  type DataTableFeatures,
} from "@/components/data-table/data-table-features"

export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[]
  data: TData[]
  emptyMessage?: React.ReactNode
  className?: string
  tableClassName?: string
  /** `plain` for nesting inside `DataTableCard`; `bordered` for standalone. */
  variant?: "plain" | "bordered"
  getRowId?: (originalRow: TData, index: number) => string
  /** Server-driven lists: pass the current page of rows and total row count. */
  manualPagination?: boolean
  rowCount?: number
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  columnVisibility?: ColumnVisibilityState
  onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  toolbar?: (table: DataTableInstance<TData>) => React.ReactNode
  footer?: (table: DataTableInstance<TData>) => React.ReactNode
}

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(previous)
    : updater
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage = "No results.",
  className,
  tableClassName,
  variant = "bordered",
  getRowId,
  manualPagination = false,
  rowCount,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  toolbar,
  footer,
}: DataTableProps<TData>) {
  const [uncontrolledSorting, setUncontrolledSorting] =
    React.useState<SortingState>([])
  const [uncontrolledColumnFilters, setUncontrolledColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [uncontrolledColumnVisibility, setUncontrolledColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [uncontrolledRowSelection, setUncontrolledRowSelection] =
    React.useState<RowSelectionState>({})
  const [uncontrolledPagination, setUncontrolledPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const sorting = controlledSorting ?? uncontrolledSorting
  const columnFilters = controlledColumnFilters ?? uncontrolledColumnFilters
  const columnVisibility =
    controlledColumnVisibility ?? uncontrolledColumnVisibility
  const rowSelection = controlledRowSelection ?? uncontrolledRowSelection
  const pagination = controlledPagination ?? uncontrolledPagination

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    manualPagination,
    rowCount,
    pageCount,
    onSortingChange: (updater) => {
      const next = resolveUpdater(updater, sorting)
      onSortingChange?.(next)
      if (controlledSorting === undefined) {
        setUncontrolledSorting(next)
      }
    },
    onColumnFiltersChange: (updater) => {
      const next = resolveUpdater(updater, columnFilters)
      onColumnFiltersChange?.(next)
      if (controlledColumnFilters === undefined) {
        setUncontrolledColumnFilters(next)
      }
    },
    onColumnVisibilityChange: (updater) => {
      const next = resolveUpdater(updater, columnVisibility)
      onColumnVisibilityChange?.(next)
      if (controlledColumnVisibility === undefined) {
        setUncontrolledColumnVisibility(next)
      }
    },
    onRowSelectionChange: (updater) => {
      const next = resolveUpdater(updater, rowSelection)
      onRowSelectionChange?.(next)
      if (controlledRowSelection === undefined) {
        setUncontrolledRowSelection(next)
      }
    },
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, pagination)
      onPaginationChange?.(next)
      if (controlledPagination === undefined) {
        setUncontrolledPagination(next)
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  const tableNode = (
    <Table className={cn(variant === "plain" && "table-fixed", tableClassName)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta as
                DataTableColumnMeta | undefined

              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "whitespace-normal",
                    meta?.headerClassName ?? meta?.className
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as
                  DataTableColumnMeta | undefined

                return (
                  <TableCell
                    key={cell.id}
                    className={cn("whitespace-normal", meta?.className)}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <div
      data-slot="data-table"
      className={cn("flex w-full flex-col gap-4", className)}
    >
      {toolbar?.(table)}
      {variant === "bordered" ? (
        <div className="overflow-hidden rounded-lg border">{tableNode}</div>
      ) : (
        tableNode
      )}
      {footer?.(table)}
    </div>
  )
}
