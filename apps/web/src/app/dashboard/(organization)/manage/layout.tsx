import { redirect } from "next/navigation"
import { Suspense } from "react"
import { OrganizationManageHeader } from "@/app/dashboard/(organization)/manage/components/organization-manage-header"
import { canAccessOrganizationManage } from "@/app/dashboard/(organization)/manage/lib/can-access-organization-manage"
import { organizationManageTabs } from "@/app/dashboard/(organization)/manage/lib/organization-manage-tabs"
import {
  DashboardPageFallback,
  DashboardPageShell,
} from "@/app/dashboard/components/layout/dashboard-page-shell"
import { DashboardSubnav } from "@/app/dashboard/components/layout/dashboard-subnav"
import { Skeleton } from "@repo/ui/components/skeleton"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { resolveDashboardActiveOrganizationId } from "@/app/dashboard/lib/dashboard-session"

type OrganizationManageLayoutProps = {
  children: React.ReactNode
}

export default function OrganizationManageLayout({
  children,
}: OrganizationManageLayoutProps) {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <OrganizationManageLayoutContent>
        {children}
      </OrganizationManageLayoutContent>
    </Suspense>
  )
}

async function OrganizationManageLayoutContent({
  children,
}: OrganizationManageLayoutProps) {
  const organizationId = await resolveDashboardActiveOrganizationId()

  if (!organizationId) {
    redirect(dashboardRoutes.home())
  }

  if (!(await canAccessOrganizationManage(organizationId))) {
    redirect(dashboardRoutes.home())
  }

  return (
    <DashboardPageShell>
      <header className="space-y-4">
        <Suspense fallback={<Skeleton className="h-10 w-48" />}>
          <OrganizationManageHeader organizationId={organizationId} />
        </Suspense>
        <DashboardSubnav
          tabs={organizationManageTabs.map(({ icon: _, ...tab }) => tab)}
          defaultTabKey={organizationManageTabs[0].key}
        />
      </header>
      {children}
    </DashboardPageShell>
  )
}
