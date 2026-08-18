import { Suspense } from "react"
import { redirect } from "next/navigation"
import { organizationManageTabs } from "@/app/dashboard/(organization)/manage/lib/organization-manage-tabs"
import { canAccessOrganizationManage } from "@/app/dashboard/(organization)/manage/lib/can-access-organization-manage"
import {
  DashboardPageFallback,
  DashboardPageShell,
} from "@/app/dashboard/components/layout/dashboard-page-shell"
import { DashboardSubnav } from "@/app/dashboard/components/layout/dashboard-subnav"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { resolveDashboardActiveOrganizationId } from "@/app/dashboard/lib/dashboard-session"
import { getTranslations } from "next-intl/server"

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

  const t = await getTranslations("dashboard")

  return (
    <DashboardPageShell>
      <header className="space-y-4">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          {t("organizationManage.title")}
        </h1>
        <DashboardSubnav
          tabs={organizationManageTabs.map(({ icon: Icon, ...tab }) => ({
            ...tab,
            icon: <Icon aria-hidden />,
          }))}
          defaultTabKey={organizationManageTabs[0].key}
        />
      </header>
      {children}
    </DashboardPageShell>
  )
}
