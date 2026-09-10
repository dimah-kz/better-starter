import { redirect } from "next/navigation"
import { Suspense } from "react"
import { adminSlices } from "@/app/dashboard/admin/lib/admin-slices"
import { DashboardSubnav } from "@/app/dashboard/components/layout/dashboard-subnav"
import {
  DashboardPageFallback,
  DashboardPageShell,
} from "@/app/dashboard/components/layout/dashboard-page-shell"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { headers } from "next/headers"
import { auth } from "@repo/auth"
import { getTranslations } from "next-intl/server"

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  )
}

async function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { user: ["list"] } },
  })

  if (!success) {
    redirect(dashboardRoutes.home())
  }

  const t = await getTranslations("dashboard")

  return (
    <DashboardPageShell>
      <header className="space-y-4">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          {t("adminPage.title")}
        </h1>
        <DashboardSubnav
          tabs={adminSlices.map(({ icon: Icon, ...tab }) => ({
            ...tab,
            icon: <Icon aria-hidden />,
          }))}
          defaultTabKey={adminSlices[0].key}
        />
      </header>
      {children}
    </DashboardPageShell>
  )
}
