import type { LucideIcon } from "lucide-react"

export const LIST_PAGE_SIZES = [10, 20, 50, 100] as const

export type ListSearchParamsInput = {
  page?: number
  pageSize?: number
  filter?: string
  q?: string
}

export type ListPaginationProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: readonly number[]
  /** Noun for screen readers, e.g. `user` */
  countLabel?: string
  className?: string
}

export type ListFilterOption<T extends string = string> = {
  value: T
  label: string
  icon?: LucideIcon
}
