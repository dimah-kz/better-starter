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
  MEMBERS_DEFAULT_PAGE_SIZE,
  parseMemberTableFilter,
  type MemberTableFilter,
} from "@/app/dashboard/(organization)/manage/members/lib/members-table-params"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { member, user } from "@repo/db/schema"
import {
  clampListPage,
  parseListFilter,
  parseListPage,
  parseListPageSize,
  parseListQuery,
} from "@/components/list"
import { db } from "@repo/db"

const MIN_QUERY_LENGTH = 2

function roleColumnHasToken(column: typeof member.role, token: string): SQL {
  return or(
    eq(column, token),
    like(column, `${token},%`),
    like(column, `%,${token}`),
    like(column, `%,${token},%`)
  )!
}

export type OrganizationMemberItem = {
  id: string
  userId: string
  name: string
  email: string
  image: string | null
  role: string
  joinedAt: string
}

export type OrganizationMembersPageQuery = {
  page: number
  pageSize: number
  filter: MemberTableFilter
  q?: string
}

export type OrganizationMembersPageResult = {
  members: OrganizationMemberItem[]
  totalCount: number
  page: number
  pageSize: number
  filter: MemberTableFilter
  q?: string
}

function buildMembersWhere(
  organizationId: string,
  filter: MemberTableFilter,
  q?: string
): SQL {
  const conditions: SQL[] = [eq(member.organizationId, organizationId)]

  if (filter === "managers") {
    conditions.push(
      or(
        roleColumnHasToken(member.role, "owner"),
        roleColumnHasToken(member.role, "admin")
      )!
    )
  } else if (filter === "members") {
    conditions.push(
      and(
        roleColumnHasToken(member.role, "member"),
        not(roleColumnHasToken(member.role, "owner")),
        not(roleColumnHasToken(member.role, "admin"))
      )!
    )
  }

  if (q && q.length >= MIN_QUERY_LENGTH) {
    conditions.push(
      or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`))!
    )
  }

  return and(...conditions)!
}

export function parseOrganizationMembersPageQuery(
  searchParams: Record<string, string | string[] | undefined>
): OrganizationMembersPageQuery {
  return {
    page: parseListPage(searchParams),
    pageSize: parseListPageSize(searchParams, {
      defaultPageSize: MEMBERS_DEFAULT_PAGE_SIZE,
    }),
    filter: parseMemberTableFilter(parseListFilter(searchParams)),
    q: parseListQuery(searchParams),
  }
}

async function loadOrganizationMembersPage(
  organizationId: string,
  query: OrganizationMembersPageQuery
): Promise<OrganizationMembersPageResult> {
  const where = buildMembersWhere(organizationId, query.filter, query.q)

  const [countRow] = await db
    .select({ totalCount: count() })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(where)
  const totalCount = countRow?.totalCount ?? 0

  const page = clampListPage(query.page, totalCount, query.pageSize)
  const skip = (page - 1) * query.pageSize

  const members = await db
    .select({
      id: member.id,
      userId: member.userId,
      name: user.name,
      email: user.email,
      image: user.image,
      role: member.role,
      createdAt: member.createdAt,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(where)
    .orderBy(desc(member.createdAt))
    .limit(query.pageSize)
    .offset(skip)

  return {
    members: members.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      email: row.email,
      image: row.image,
      role: row.role,
      joinedAt: row.createdAt.toISOString(),
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    filter: query.filter,
    q: query.q,
  }
}

export async function getOrganizationMembersPage(
  organizationId: string,
  query: OrganizationMembersPageQuery
) {
  "use cache"

  cacheLife("minutes")
  cacheTag(dashboardCacheTags.organizationMembersById(organizationId))

  return loadOrganizationMembersPage(organizationId, query)
}
