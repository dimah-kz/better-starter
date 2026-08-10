import { Suspense } from "react"
import { AdminUserManagementPanel } from "@/app/dashboard/admin/users/components/admin-user-management-panel"
import {
  getAdminUsersPage,
  parseAdminUsersPageQuery,
} from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { Card, CardContent } from "@repo/ui/components/card"
import { Skeleton } from "@repo/ui/components/skeleton"
import { headers } from "next/headers"
import { auth } from "@repo/auth"

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function AdminUsersPage(props: AdminUsersPageProps) {
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
