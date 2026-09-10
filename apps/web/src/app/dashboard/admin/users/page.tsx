import { Suspense } from "react"
import { AdminUserManagementPanel } from "@/app/dashboard/admin/users/components/admin-user-management-panel"
import {
  getAdminUsersPage,
  parseAdminUsersPageQuery,
} from "@/app/dashboard/admin/users/lib/get-admin-users-page"
import { requireDashboardSession } from "@/app/dashboard/lib/dashboard-session"
import { ListSkeleton } from "@/components/list"

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function AdminUsersPage(props: AdminUsersPageProps) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <AdminUsersPageContent {...props} />
    </Suspense>
  )
}

async function AdminUsersPageContent({ searchParams }: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams
  const query = parseAdminUsersPageQuery(resolvedSearchParams)
  const [session, data] = await Promise.all([
    requireDashboardSession(),
    getAdminUsersPage(query),
  ])

  return (
    <AdminUserManagementPanel
      users={data.users}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
      q={data.q}
      actorUserId={session.user.id}
    />
  )
}
