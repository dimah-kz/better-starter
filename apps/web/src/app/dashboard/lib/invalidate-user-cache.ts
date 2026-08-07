import { updateTag } from "next/cache"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"

export function invalidateUserCache(userId: string) {
  updateTag(dashboardCacheTags.userProfileById(userId))
  updateTag(dashboardCacheTags.sidebarConfigByUser(userId))
}
