import { Suspense } from "react"
import { MemberManagementPanel } from "@/app/dashboard/(organization)/manage/members/components/member-management-panel"
import {
  getOrganizationMembersPage,
  parseOrganizationMembersPageQuery,
} from "@/app/dashboard/(organization)/manage/members/lib/get-organization-members-page"
import { resolveDashboardActiveOrganizationId } from "@/app/dashboard/lib/dashboard-session"
import { Card, CardContent } from "@repo/ui/components/card"
import { Skeleton } from "@repo/ui/components/skeleton"
import { getActorOrganizationRole } from "@/app/dashboard/(organization)/manage/members/lib/get-actor-organization-role"
import { headers } from "next/headers"
import { auth } from "@repo/auth"

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
          <CardContent className="flex min-w-0 flex-col gap-3 py-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
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
