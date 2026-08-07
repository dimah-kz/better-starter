"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import type {
  ListPaginationProps,
  ListSearchParamsInput,
} from "@/components/list/types"

type UseListOptions<TFilter extends string = string> = {
  buildPath: (input: ListSearchParamsInput & { filter?: TFilter }) => string
  page: number
  pageSize: number
  totalCount: number
  filter?: TFilter
  q?: string
  countLabel?: string
  pageSizeOptions?: readonly number[]
}

export function useList<TFilter extends string = string>({
  buildPath,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  countLabel,
  pageSizeOptions,
}: UseListOptions<TFilter>) {
  const router = useRouter()

  const navigate = useCallback(
    (
      patch: Partial<{
        page: number
        pageSize: number
        filter: TFilter
        q?: string
      }>
    ) => {
      router.push(
        buildPath({
          page: patch.page ?? page,
          pageSize: patch.pageSize ?? pageSize,
          filter: patch.filter ?? filter,
          q: patch.q !== undefined ? patch.q : q,
        })
      )
    },
    [buildPath, filter, page, pageSize, q, router]
  )

  const buildSearchPath = useCallback(
    (input: { q?: string; page?: number }) =>
      buildPath({
        page: input.page ?? 1,
        pageSize,
        filter,
        q: input.q,
      }),
    [buildPath, filter, pageSize]
  )

  const pagination: ListPaginationProps = {
    page,
    pageSize,
    totalCount,
    countLabel,
    pageSizeOptions,
    onPageChange: (nextPage) => navigate({ page: nextPage }),
    onPageSizeChange: (nextPageSize) =>
      navigate({ page: 1, pageSize: nextPageSize }),
  }

  return {
    navigate,
    buildSearchPath,
    setFilter: (nextFilter: TFilter) =>
      navigate({ page: 1, filter: nextFilter }),
    pagination,
  }
}
