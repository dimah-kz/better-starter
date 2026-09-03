import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { authRoutes } from "@/app/(auth)/lib/auth-routes"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import { buttonVariants } from "@repo/ui/components/button"
import { cn } from "@repo/ui/lib/utils"

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
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {tAuth("login.title")}
        </Link>
        <Link
          href={dashboardRoutes.home()}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          {tDashboard("nav.sidebar.dashboard")}
        </Link>
      </div>
    </main>
  )
}
