import { cacheLife, cacheTag } from "next/cache"
import { count, desc, eq, ilike, or, type SQL } from "@repo/db/drizzle"
import { ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { member, organization } from "@repo/db/schema"
import {
  clampListPage,
  parseListPage,
  parseListPageSize,
  parseListQuery,
} from "@/components/list"
import { db } from "@repo/db"

const MIN_QUERY_LENGTH = 2

export type AdminOrganizationItem = {
  id: string
  name: string
  slug: string
  logo: string | null
  memberCount: number
  createdAt: string
}

export type AdminOrganizationsPageQuery = {
  page: number
  pageSize: number
  q?: string
}

export type AdminOrganizationsPageResult = {
  organizations: AdminOrganizationItem[]
  totalCount: number
  page: number
  pageSize: number
  q?: string
}

function buildOrganizationsWhere(q?: string): SQL | undefined {
  if (!q || q.length < MIN_QUERY_LENGTH) {
    return undefined
  }

  return or(
    ilike(organization.name, `%${q}%`),
    ilike(organization.slug, `%${q}%`)
  )
}

export function parseAdminOrganizationsPageQuery(
  searchParams: Record<string, string | string[] | undefined>
): AdminOrganizationsPageQuery {
  return {
    page: parseListPage(searchParams),
    pageSize: parseListPageSize(searchParams, {
      defaultPageSize: ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE,
    }),
    q: parseListQuery(searchParams),
  }
}

async function loadAdminOrganizationsPage(
  query: AdminOrganizationsPageQuery
): Promise<AdminOrganizationsPageResult> {
  const where = buildOrganizationsWhere(query.q)

  const [countRow] = await db
    .select({ totalCount: count() })
    .from(organization)
    .where(where)
  const totalCount = countRow?.totalCount ?? 0

  const page = clampListPage(query.page, totalCount, query.pageSize)
  const skip = (page - 1) * query.pageSize

  const organizations = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      createdAt: organization.createdAt,
      memberCount: count(member.id),
    })
    .from(organization)
    .leftJoin(member, eq(member.organizationId, organization.id))
    .where(where)
    .groupBy(
      organization.id,
      organization.name,
      organization.slug,
      organization.logo,
      organization.createdAt
    )
    .orderBy(desc(organization.createdAt))
    .limit(query.pageSize)
    .offset(skip)

  return {
    organizations: organizations.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo: row.logo,
      memberCount: row.memberCount,
      createdAt: row.createdAt.toISOString(),
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    q: query.q,
  }
}

export async function getAdminOrganizationsPage(
  query: AdminOrganizationsPageQuery
) {
  "use cache"

  cacheLife("minutes")
  cacheTag(dashboardCacheTags.adminOrganizationsPage())

  return loadAdminOrganizationsPage(query)
}
