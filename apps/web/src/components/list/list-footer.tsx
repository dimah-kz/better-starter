"use client"

import { type ComponentProps } from "react"
import { cn } from "@repo/ui/lib/utils"
import { ListPagination } from "@/components/list/list-pagination"
import type { ListPaginationProps } from "@/components/list/types"

type ListFooterProps = ComponentProps<"div"> & {
  pagination?: ListPaginationProps | null
}

/** URL-driven list footer — wraps `ListPagination` when there are rows. */
export function ListFooter({
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
