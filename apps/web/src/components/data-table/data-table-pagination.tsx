"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@repo/ui/components/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"
import { cn } from "@repo/ui/lib/utils"
import type { DataTableFeatures } from "@/components/data-table/data-table-features"
import { LIST_PAGE_SIZES } from "@/components/list/types"

type DataTablePaginationProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>
  pageSizeOptions?: readonly number[]
  className?: string
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = LIST_PAGE_SIZES,
  className,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations("tables.pagination")
  const selected = table.getFilteredSelectedRowModel().rows.length
  const filtered = table.getFilteredRowModel().rows.length

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2",
        className
      )}
    >
      <div className="flex-1 text-xs text-muted-foreground">
        {t("selected", { selected, total: filtered })}
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium">{t("rowsPerPage")}</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              if (!value) return
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger size="sm" className="h-8 w-[4.5rem]">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" align="end">
              <SelectGroup>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-24 items-center justify-center text-xs font-medium">
          {t("page", {
            page: table.state.pagination.pageIndex + 1,
            pageCount: table.getPageCount() || 1,
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("firstPage")}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("previousPage")}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("nextPage")}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("lastPage")}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
