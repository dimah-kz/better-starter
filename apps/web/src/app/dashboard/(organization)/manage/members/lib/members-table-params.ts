import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import {
  listPath,
  parseListEnumFilter,
  type ListSearchParamsInput,
} from "@/components/list"

export const MEMBERS_DEFAULT_PAGE_SIZE = 20

export type MemberTableFilter = "all" | "managers" | "members"

const MEMBER_TABLE_FILTERS = [
  "all",
  "managers",
  "members",
] as const satisfies readonly MemberTableFilter[]

export function parseMemberTableFilter(
  value: string | undefined
): MemberTableFilter {
  return parseListEnumFilter(value, MEMBER_TABLE_FILTERS, "all")
}

export function organizationMembersTablePath(
  input: ListSearchParamsInput & {
    filter?: MemberTableFilter
  } = {}
): string {
  const filter =
    input.filter && input.filter !== "all" ? input.filter : undefined

  return listPath(
    dashboardRoutes.organizationMembers(),
    {
      page: input.page,
      pageSize: input.pageSize,
      filter,
      q: input.q,
    },
    { defaultPageSize: MEMBERS_DEFAULT_PAGE_SIZE }
  )
}
