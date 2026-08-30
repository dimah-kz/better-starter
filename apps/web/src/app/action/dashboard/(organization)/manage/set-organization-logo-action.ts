"use server"

import { invalidateOrganizationBrandingCache } from "@/app/action/dashboard/(organization)/manage/shared/invalidate-organization-manage-cache"
import { getActiveOrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { deleteOwnedAvatar } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { updateTag } from "next/cache"
import { auth, getAuthApiErrorMessage } from "@repo/auth"
import { objectKeyMatches, toPublicUrl } from "@repo/storage"

export async function setOrganizationLogoAction(
  organizationId: string,
  key: string
) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  const t = await getTranslations("common.errors")
  if (!session) {
    return { error: t("unauthorized") }
  }

  const owner = { kind: "org" as const, id: organizationId }
  if (!objectKeyMatches(key, owner, "avatars")) {
    return { error: t("invalidAvatarKey") }
  }

  const imageUrl = toPublicUrl(key)
  if (!imageUrl) {
    return { error: t("storagePublicUrlMissing") }
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

  await deleteOwnedAvatar({
    previousUrl,
    owner,
    headers: requestHeaders,
    exceptKey: key,
  })

  invalidateOrganizationBrandingCache(organizationId)
  updateTag(dashboardCacheTags.sidebarConfigByUser(session.user.id))

  return { success: true as const, imageUrl }
}
