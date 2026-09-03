import { Suspense } from "react"
import { MemberManagementPanel } from "@/app/dashboard/(organization)/manage/members/components/member-management-panel"
import {
  getOrganizationMembersPage,
  parseOrganizationMembersPageQuery,
} from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import {
  requireDashboardSession,
  resolveDashboardActiveOrganizationId,
} from "@/app/dashboard/lib/dashboard-session"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { ListSkeleton } from "@/components/list"
import { getActorOrganizationRole } from "@/app/dashboard/(organization)/manage/members/lib/get-actor-organization-role"
import { redirect } from "next/navigation"

type OrganizationMembersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function OrganizationMembersPage(
  props: OrganizationMembersPageProps
) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <OrganizationMembersPageContent {...props} />
    </Suspense>
  )
}

async function OrganizationMembersPageContent({
  searchParams,
}: OrganizationMembersPageProps) {
  const organizationId = await resolveDashboardActiveOrganizationId()

  if (!organizationId) {
    redirect(dashboardRoutes.home())
  }

  const resolvedSearchParams = await searchParams
  const query = parseOrganizationMembersPageQuery(resolvedSearchParams)
  const session = await requireDashboardSession()
  const data = await getOrganizationMembersPage(organizationId, query)

  const actorRole = await getActorOrganizationRole()

  return (
    <MemberManagementPanel
      organizationId={organizationId}
      members={data.members}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
      q={data.q}
      actorUserId={session.user.id}
      actorRole={actorRole}
    />
  )
}
