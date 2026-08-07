"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { formatNumber } from "@better-starter/i18n"
import { cn } from "@workspace/ui/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import {
  LIST_PAGE_SIZES,
  type ListPaginationProps,
} from "@/components/list/types"

function itemRange(page: number, pageSize: number, totalCount: number) {
  if (totalCount <= 0) {
    return { start: 0, end: 0 }
  }

  return {
    start: (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, totalCount),
  }
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages: (number | "...")[] = [1]

  if (current > 3) {
    pages.push("...")
  }

  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page++
  ) {
    pages.push(page)
  }

  if (current < total - 2) {
    pages.push("...")
  }

  pages.push(total)
  return pages
}

export function ListPagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = LIST_PAGE_SIZES,
  countLabel,
  className,
}: ListPaginationProps) {
  const locale = useLocale()
  const t = useTranslations("common")
  const resolvedCountLabel = countLabel ?? t("item")
  const formatValue = (value: number) => formatNumber(value, locale)

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const { start, end } = itemRange(safePage, pageSize, totalCount)
  const showPagination = totalPages > 1
  const atFirst = safePage <= 1
  const atLast = safePage >= totalPages
  const pluralSuffix = totalCount === 1 ? "" : "s"

  return (
    <div
      data-slot="list-pagination"
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-2 text-xs text-muted-foreground tabular-nums",
        className
      )}
    >
      <span
        className="shrink-0 max-sm:order-1"
        aria-label={t("pagination.rangeAria", {
          start: formatValue(start),
          end: formatValue(end),
          total: formatValue(totalCount),
          countLabel: `${resolvedCountLabel}${pluralSuffix}`,
        })}
      >
        {t("pagination.range", {
          start: formatValue(start),
          end: formatValue(end),
          total: formatValue(totalCount),
        })}
      </span>

      {showPagination ? (
        <Pagination className="w-auto shrink-0 max-sm:order-3 max-sm:basis-full max-sm:justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text={t("pagination.previous")}
                onClick={() => onPageChange(Math.max(1, safePage - 1))}
                aria-disabled={atFirst}
                className={atFirst ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageNumbers(safePage, totalPages).map((num, index) =>
              num === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={num}>
                  <PaginationLink
                    isActive={num === safePage}
                    onClick={() => onPageChange(num)}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                text={t("pagination.next")}
                onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
                aria-disabled={atLast}
                className={atLast ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <Select
        value={String(pageSize)}
        onValueChange={(next) => {
          if (!next) {
            return
          }
          const parsed = Number.parseInt(next, 10)
          if (Number.isFinite(parsed)) {
            onPageSizeChange(parsed)
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="h-6 min-w-14 shrink-0 px-2 max-sm:order-2 max-sm:ms-auto"
          aria-label={t("pagination.rowsPerPage")}
        >
          <SelectValue>{formatValue(pageSize)}</SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {formatValue(size)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
