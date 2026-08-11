import type { AccountSecurityPanel } from "@/app/dashboard/account/lib/account-panel"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import type { LucideIcon } from "lucide-react"
import { KeyRoundIcon, MonitorSmartphoneIcon, ShieldIcon } from "lucide-react"

export const accountHubSections = [
  {
    key: "security",
    labelKey: "accountSettings.securityOverview",
    descriptionKey: "accountSettings.securityDescription",
    icon: ShieldIcon,
    href: dashboardRoutes.accountSecurity(),
  },
] as const satisfies ReadonlyArray<{
  key: string
  labelKey: string
  descriptionKey: string
  icon: LucideIcon
  href: string
}>

export const accountSecurityItems = [
  {
    key: "password",
    labelKey: "accountSettings.password",
    descriptionKey: "accountSettings.passwordDescription",
    icon: KeyRoundIcon,
  },
  {
    key: "sessions",
    labelKey: "accountSettings.sessions",
    descriptionKey: "accountSettings.sessionsDescription",
    icon: MonitorSmartphoneIcon,
  },
] as const satisfies ReadonlyArray<{
  key: AccountSecurityPanel
  labelKey: string
  descriptionKey: string
  icon: LucideIcon
}>
