import { Suspense } from "react"
import { AdminUserManagementPanel } from "@/app/dashboard/admin/users/components/admin-user-management-panel"
import {
  getAdminUsersPage,
  parseAdminUsersPageQuery,
} from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { ListSkeleton } from "@/components/list"
import { Card, CardContent } from "@workspace/ui/components/card"
import { headers } from "next/headers"
import { auth } from "@better-starter/auth"

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function AdminUsersPage(props: AdminUsersPageProps) {
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
      <AdminUsersPageContent {...props} />
    </Suspense>
  )
}

async function AdminUsersPageContent({ searchParams }: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams
  const query = parseAdminUsersPageQuery(resolvedSearchParams)
  const session = await auth.api.getSession({ headers: await headers() })
  const data = await getAdminUsersPage(query)

  return (
    <AdminUserManagementPanel
      users={data.users}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
      q={data.q}
      actorUserId={session!.user.id}
    />
  )
}
