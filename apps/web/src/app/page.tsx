import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { authRoutes } from "@/app/(auth)/lib/auth-routes"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"

export default async function Home() {
  const t = await getTranslations("common")
  const tAuth = await getTranslations("auth")
  const tDashboard = await getTranslations("dashboard")

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("appTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("home.lede")}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={authRoutes.login()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {tAuth("login.title")}
        </Link>
        <Link
          href={dashboardRoutes.home()}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          {tDashboard("nav.sidebar.dashboard")}
        </Link>
      </div>
    </main>
  )
}
