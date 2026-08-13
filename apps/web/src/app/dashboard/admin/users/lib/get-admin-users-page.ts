import { cacheLife, cacheTag } from "next/cache"
import {
  and,
  count,
  desc,
  eq,
  ilike,
  like,
  not,
  or,
  type SQL,
} from "@repo/db/drizzle"
import {
  ADMIN_USERS_DEFAULT_PAGE_SIZE,
  parseAdminUserTableFilter,
  type AdminUserTableFilter,
} from "@/app/dashboard/admin/users/lib/admin-users-table-params"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { user } from "@repo/db/schema"
import {
  LIST_SEARCH_MIN_LENGTH,
  clampListPage,
  parseListFilter,
  parseListPage,
  parseListPageSize,
  parseListQuery,
} from "@/components/list"
import { db } from "@repo/db"

function roleColumnHasToken(column: typeof user.role, token: string): SQL {
  return or(
    eq(column, token),
    like(column, `${token},%`),
    like(column, `%,${token}`),
    like(column, `%,${token},%`)
  )!
}

export type AdminUserItem = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  banned: boolean
  createdAt: string
}

export type AdminUsersPageQuery = {
  page: number
  pageSize: number
  filter: AdminUserTableFilter
  q?: string
}

export type AdminUsersPageResult = {
  users: AdminUserItem[]
  totalCount: number
  page: number
  pageSize: number
  filter: AdminUserTableFilter
  q?: string
}

function buildUsersWhere(
  filter: AdminUserTableFilter,
  q?: string
): SQL | undefined {
  const conditions: SQL[] = []

  if (filter === "admins") {
    conditions.push(roleColumnHasToken(user.role, "admin"))
  } else if (filter === "users") {
    conditions.push(
      and(
        roleColumnHasToken(user.role, "user"),
        not(roleColumnHasToken(user.role, "admin"))
      )!
    )
  } else if (filter === "banned") {
    conditions.push(eq(user.banned, true))
  }

  if (q && q.length >= LIST_SEARCH_MIN_LENGTH) {
    conditions.push(
      or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`))!
    )
  }

  return conditions.length ? and(...conditions) : undefined
}

export function parseAdminUsersPageQuery(
  searchParams: Record<string, string | string[] | undefined>
): AdminUsersPageQuery {
  const q = parseListQuery(searchParams)

  return {
    page: parseListPage(searchParams),
    pageSize: parseListPageSize(searchParams, {
      defaultPageSize: ADMIN_USERS_DEFAULT_PAGE_SIZE,
    }),
    filter: parseAdminUserTableFilter(parseListFilter(searchParams)),
    q,
  }
}

async function loadAdminUsersPage(
  query: AdminUsersPageQuery
): Promise<AdminUsersPageResult> {
  const where = buildUsersWhere(query.filter, query.q)

  const [countRow] = await db
    .select({ totalCount: count() })
    .from(user)
    .where(where)
  const totalCount = countRow?.totalCount ?? 0

  const page = clampListPage(query.page, totalCount, query.pageSize)
  const skip = (page - 1) * query.pageSize

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(where)
    .orderBy(desc(user.createdAt))
    .limit(query.pageSize)
    .offset(skip)

  return {
    users: users.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      role: row.role ?? "user",
      banned: row.banned ?? false,
      createdAt: row.createdAt.toISOString(),
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    filter: query.filter,
    q: query.q,
  }
}

export async function getAdminUsersPage(query: AdminUsersPageQuery) {
  "use cache"

  cacheLife("minutes")
  cacheTag(dashboardCacheTags.adminUsersPage())

  return loadAdminUsersPage(query)
}
