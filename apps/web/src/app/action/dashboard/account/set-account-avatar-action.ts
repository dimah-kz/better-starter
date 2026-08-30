"use server"

import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { deleteOwnedAvatar } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { auth, getAuthApiErrorMessage } from "@repo/auth"
import { objectKeyMatches, toPublicUrl } from "@repo/storage"

export async function setAccountAvatarAction(key: string) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  const t = await getTranslations("common.errors")
  if (!session) {
    return { error: t("unauthorized") }
  }

  const owner = { kind: "user" as const, id: session.user.id }
  if (!objectKeyMatches(key, owner, "avatars")) {
    return { error: t("invalidAvatarKey") }
  }

  const imageUrl = toPublicUrl(key)
  if (!imageUrl) {
    return { error: t("storagePublicUrlMissing") }
  }

  try {
    await auth.api.updateUser({
      headers: requestHeaders,
      body: { image: imageUrl },
    })
  } catch (error) {
    return { error: getAuthApiErrorMessage(error) }
  }

  await deleteOwnedAvatar({
    previousUrl: session.user.image,
    owner,
    headers: requestHeaders,
    exceptKey: key,
  })

  invalidateUserCache(session.user.id)
  return { success: true as const, imageUrl }
}
