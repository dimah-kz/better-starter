import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import {
  listPath,
  parseListEnumFilter,
  type ListSearchParamsInput,
} from "@/components/list"

export const ADMIN_USERS_DEFAULT_PAGE_SIZE = 20

export type AdminUserTableFilter = "all" | "admins" | "users" | "banned"

const ADMIN_USER_TABLE_FILTERS = [
  "all",
  "admins",
  "users",
  "banned",
] as const satisfies readonly AdminUserTableFilter[]

export function parseAdminUserTableFilter(
  value: string | undefined
): AdminUserTableFilter {
  return parseListEnumFilter(value, ADMIN_USER_TABLE_FILTERS, "all")
}

export function adminUsersTablePath(
  input: ListSearchParamsInput & {
    filter?: AdminUserTableFilter
  } = {}
): string {
  const filter =
    input.filter && input.filter !== "all" ? input.filter : undefined

  return listPath(
    dashboardRoutes.adminUsers(),
    {
      page: input.page,
      pageSize: input.pageSize,
      filter,
      q: input.q,
    },
    { defaultPageSize: ADMIN_USERS_DEFAULT_PAGE_SIZE }
  )
}
