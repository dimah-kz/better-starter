import {
  dashboardRouteSegments,
  dashboardRoutes,
} from "@/app/dashboard/lib/dashboard-routes"
import { Building2Icon, UsersIcon } from "lucide-react"

/**
 * Platform admin tabs registered for navigation and trim docs.
 */
export const adminSlices = [
  {
    key: "users",
    labelKey: "adminTabs.users",
    icon: UsersIcon,
    pathSuffix: `/${dashboardRouteSegments.users}`,
    href: dashboardRoutes.adminUsers(),
  },
  {
    key: "organizations",
    labelKey: "adminTabs.organizations",
    icon: Building2Icon,
    pathSuffix: `/${dashboardRouteSegments.organizations}`,
    href: dashboardRoutes.adminOrganizations(),
  },
] as const

export type AdminSliceKey = (typeof adminSlices)[number]["key"]
