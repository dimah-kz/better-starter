import {
  LIST_PAGE_SIZES,
  type ListSearchParamsInput,
} from "@/components/list/types"

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) =>
  value === undefined ? undefined : Array.isArray(value) ? value[0] : value

function parsePositiveInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback
}

export function parseListPage(
  searchParams: SearchParams,
  defaultPage = 1
): number {
  return parsePositiveInt(first(searchParams.page), defaultPage)
}

export function parseListPageSize(
  searchParams: SearchParams,
  options: { defaultPageSize: number; allowedSizes?: readonly number[] }
): number {
  const allowed = new Set(options.allowedSizes ?? LIST_PAGE_SIZES)
  const parsed = Number.parseInt(first(searchParams.pageSize) ?? "", 10)
  return Number.isFinite(parsed) && allowed.has(parsed)
    ? parsed
    : options.defaultPageSize
}

export function parseListFilter(searchParams: SearchParams) {
  return first(searchParams.filter)?.trim() || undefined
}

export function parseListQuery(searchParams: SearchParams) {
  return first(searchParams.q)?.trim() || undefined
}

export function parseListEnumFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T
): T {
  return value && allowed.includes(value as T) ? (value as T) : fallback
}

export function clampListPage(
  page: number,
  totalCount: number,
  pageSize: number
): number {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  return Math.min(Math.max(1, page), totalPages)
}

export function buildListSearchParams(
  input: ListSearchParamsInput,
  options: { defaultPageSize?: number } = {}
): string {
  const params = new URLSearchParams()
  const { defaultPageSize } = options

  if (input.page !== undefined && input.page > 1) {
    params.set("page", String(input.page))
  }

  if (
    input.pageSize !== undefined &&
    (defaultPageSize === undefined || input.pageSize !== defaultPageSize)
  ) {
    params.set("pageSize", String(input.pageSize))
  }

  const filter = input.filter?.trim()
  if (filter) {
    params.set("filter", filter)
  }

  const q = input.q?.trim()
  if (q) {
    params.set("q", q)
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ""
}

export function listPath(
  pathname: string,
  input: ListSearchParamsInput = {},
  options: { defaultPageSize?: number } = {}
): string {
  return `${pathname}${buildListSearchParams(input, options)}`
}
