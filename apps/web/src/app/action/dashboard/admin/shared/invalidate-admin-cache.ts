import { updateTag } from "next/cache"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"

export function invalidateAdminUsersPageCache() {
  updateTag(dashboardCacheTags.adminUsersPage())
}

export function invalidateAdminOrganizationsPageCache() {
  updateTag(dashboardCacheTags.adminOrganizationsPage())
}
