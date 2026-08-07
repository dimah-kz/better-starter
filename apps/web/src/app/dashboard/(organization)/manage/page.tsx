import { redirect } from "next/navigation"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"

export default function OrganizationManagePage() {
  redirect(dashboardRoutes.organizationMembers())
}
