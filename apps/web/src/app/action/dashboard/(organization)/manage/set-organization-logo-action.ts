"use server"

import { invalidateOrganizationBrandingCache } from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { getActiveOrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { isAvatarKey } from "@/lib/avatar-storage"
import { deleteOwnedAvatarObject } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { updateTag } from "next/cache"
import { auth, getAuthApiErrorMessage } from "@repo/auth"
import { buildPublicUrl } from "@repo/storage"

export async function setOrganizationLogoAction(
  organizationId: string,
  key: string
) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return { error: "Unauthorized" as const }
  }

  const owner = { kind: "org" as const, id: organizationId }
  if (!isAvatarKey(key, owner)) {
    return { error: "Invalid avatar key" as const }
  }

  const imageUrl = buildPublicUrl(key)
  if (!imageUrl) {
    return { error: "Public storage URL is not configured" as const }
  }

  const branding = await getActiveOrganizationBranding(organizationId)
  const previousUrl = branding?.logo ?? null

  try {
    await auth.api.updateOrganization({
      headers: requestHeaders,
      body: {
        organizationId,
        data: { logo: imageUrl },
      },
    })
  } catch (error) {
    return { error: getAuthApiErrorMessage(error) }
  }

  await deleteOwnedAvatarObject({
    previousUrl,
    owner,
    headers: requestHeaders,
    exceptKey: key,
  })

  invalidateOrganizationBrandingCache(organizationId)
  updateTag(dashboardCacheTags.sidebarConfigByUser(session.user.id))

  return { success: true as const, imageUrl }
}
