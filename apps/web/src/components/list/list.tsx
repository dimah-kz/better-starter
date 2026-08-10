"use client"

import { type ComponentProps } from "react"
import { TableCell, TableRow } from "@repo/ui/components/table"
import { cn } from "@repo/ui/lib/utils"
import { ListPagination } from "@/components/list/list-pagination"
import type { ListPaginationProps } from "@/components/list/types"

function ListRoot({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="list"
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

type ListFooterProps = ComponentProps<"div"> & {
  pagination?: ListPaginationProps | null
}

function ListFooter({
  pagination,
  className,
  children,
  ...props
}: ListFooterProps) {
  const content =
    children ??
    (pagination && pagination.totalCount > 0 ? (
      <ListPagination {...pagination} />
    ) : null)

  if (!content) {
    return null
  }

  return (
    <div data-slot="list-footer" className={cn("w-full", className)} {...props}>
      {content}
    </div>
  )
}

function ListEmpty({
  colSpan,
  className,
  children,
  ...props
}: ComponentProps<typeof TableCell> & { colSpan: number }) {
  return (
    <TableRow data-slot="list-empty">
      <TableCell
        colSpan={colSpan}
        className={cn("py-6 text-center text-muted-foreground", className)}
        {...props}
      >
        {children}
      </TableCell>
    </TableRow>
  )
}

const List = Object.assign(ListRoot, {
  Footer: ListFooter,
  Empty: ListEmpty,
})

export { List, ListFooter, ListEmpty }
