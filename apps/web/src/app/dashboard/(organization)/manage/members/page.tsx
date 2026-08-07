import { Suspense } from "react"
import { MemberManagementPanel } from "@/app/dashboard/(organization)/manage/members/components/member-management-panel"
import {
  getOrganizationMembersPage,
  parseOrganizationMembersPageQuery,
} from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import { resolveDashboardActiveOrganizationId } from "@/app/dashboard/lib/dashboard-session"
import { ListSkeleton } from "@/components/list"
import { Card, CardContent } from "@workspace/ui/components/card"
import { getActorOrganizationRole } from "@/app/dashboard/(organization)/manage/members/lib/get-actor-organization-role"
import { headers } from "next/headers"
import { auth } from "@better-starter/auth"

type OrganizationMembersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function OrganizationMembersPage(
  props: OrganizationMembersPageProps
) {
  return (
    <Suspense
      fallback={
        <Card className="w-full">
          <CardContent className="min-w-0">
            <ListSkeleton />
          </CardContent>
        </Card>
      }
    >
      <OrganizationMembersPageContent {...props} />
    </Suspense>
  )
}

async function OrganizationMembersPageContent({
  searchParams,
}: OrganizationMembersPageProps) {
  const organizationId = await resolveDashboardActiveOrganizationId()

  if (!organizationId) {
    return null
  }

  const resolvedSearchParams = await searchParams
  const query = parseOrganizationMembersPageQuery(resolvedSearchParams)
  const session = await auth.api.getSession({ headers: await headers() })
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
      actorUserId={session!.user.id}
      actorRole={actorRole}
    />
  )
}
