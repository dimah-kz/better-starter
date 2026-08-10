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
  buildPageHref: (page: number) => string
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: readonly number[]
  /** Noun for screen readers, e.g. already-localized `members` */
  countLabel?: string
  className?: string
}
