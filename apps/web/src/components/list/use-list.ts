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
          q: "q" in patch ? patch.q : q,
        })
      )
    },
    [buildPath, filter, page, pageSize, q, router]
  )

  const buildPageHref = useCallback(
    (nextPage: number) =>
      buildPath({
        page: nextPage,
        pageSize,
        filter,
        q,
      }),
    [buildPath, filter, pageSize, q]
  )

  const setQuery = useCallback(
    (nextQuery?: string) => {
      navigate({ page: 1, q: nextQuery })
    },
    [navigate]
  )

  const pagination: ListPaginationProps = {
    page,
    pageSize,
    totalCount,
    countLabel,
    pageSizeOptions,
    buildPageHref,
    onPageSizeChange: (nextPageSize) =>
      navigate({ page: 1, pageSize: nextPageSize }),
  }

  return {
    navigate,
    setQuery,
    setFilter: (nextFilter: TFilter) =>
      navigate({ page: 1, filter: nextFilter }),
    pagination,
  }
}
