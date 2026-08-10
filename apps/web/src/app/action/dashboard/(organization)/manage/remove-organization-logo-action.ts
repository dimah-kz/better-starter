"use server"

import { invalidateOrganizationBrandingCache } from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { getActiveOrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { deleteOwnedAvatarObject } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { updateTag } from "next/cache"
import { auth, getAuthApiErrorMessage } from "@repo/auth"

export async function removeOrganizationLogoAction(organizationId: string) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return { error: "Unauthorized" as const }
  }

  const branding = await getActiveOrganizationBranding(organizationId)
  const previousUrl = branding?.logo ?? null

  try {
    await auth.api.updateOrganization({
      headers: requestHeaders,
      body: {
        organizationId,
        data: { logo: "" },
      },
    })
  } catch (error) {
    return { error: getAuthApiErrorMessage(error) }
  }

  await deleteOwnedAvatarObject({
    previousUrl,
    owner: { kind: "org", id: organizationId },
    headers: requestHeaders,
  })

  invalidateOrganizationBrandingCache(organizationId)
  updateTag(dashboardCacheTags.sidebarConfigByUser(session.user.id))

  return { success: true as const }
}
