import {
  dashboardRouteSegments,
  dashboardRoutes,
} from "@/app/dashboard/lib/dashboard-routes"
import { UsersIcon } from "lucide-react"

/** Add a row when you add a manage route under `dashboard/manage/<segment>/`. */
export const organizationManageTabs = [
  {
    key: "members",
    labelKey: "manageTabs.members",
    icon: UsersIcon,
    pathSuffix: `/${dashboardRouteSegments.members}`,
    href: dashboardRoutes.organizationMembers(),
  },
] as const

export type OrganizationManageTabKey =
  (typeof organizationManageTabs)[number]["key"]
