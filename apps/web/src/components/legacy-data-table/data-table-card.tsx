"use client"

import type { ReactNode } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { cn } from "@repo/ui/lib/utils"

type DataTableCardProps = {
  title: ReactNode
  toolbar?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Standard dashboard shell: Card + title + toolbar + table body + footer.
 * Compose with `ListSearch` / `ListPagination` for URL-driven lists,
 * or `DataTableViewOptions` / `DataTablePagination` for client-side tables.
 */
export function DataTableCard({
  title,
  toolbar,
  footer,
  children,
  className,
}: DataTableCardProps) {
  return (
    <Card data-slot="data-table-card" className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {toolbar ? (
          <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {toolbar}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
      {footer ? (
        <CardFooter className="justify-between gap-2">{footer}</CardFooter>
      ) : null}
    </Card>
  )
}
