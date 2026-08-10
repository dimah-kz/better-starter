import { Suspense } from "react"
import { AdminOrganizationManagementPanel } from "@/app/dashboard/admin/organizations/components/admin-organization-management-panel"
import {
  getAdminOrganizationsPage,
  parseAdminOrganizationsPageQuery,
} from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import { Card, CardContent } from "@repo/ui/components/card"
import { Skeleton } from "@repo/ui/components/skeleton"

type AdminOrganizationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function AdminOrganizationsPage(
  props: AdminOrganizationsPageProps
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
      <AdminOrganizationsPageContent {...props} />
    </Suspense>
  )
}

async function AdminOrganizationsPageContent({
  searchParams,
}: AdminOrganizationsPageProps) {
  const resolvedSearchParams = await searchParams
  const query = parseAdminOrganizationsPageQuery(resolvedSearchParams)
  const data = await getAdminOrganizationsPage(query)

  return (
    <AdminOrganizationManagementPanel
      organizations={data.organizations}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      q={data.q}
    />
  )
}
