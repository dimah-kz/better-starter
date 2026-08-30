"use server"

import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { deleteOwnedAvatar } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { auth, getAuthApiErrorMessage } from "@repo/auth"

export async function removeAccountAvatarAction() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    const t = await getTranslations("common.errors")
    return { error: t("unauthorized") }
  }

  const previousUrl = session.user.image

  try {
    await auth.api.updateUser({
      headers: requestHeaders,
      body: { image: "" },
    })
  } catch (error) {
    return { error: getAuthApiErrorMessage(error) }
  }

  await deleteOwnedAvatar({
    previousUrl,
    owner: { kind: "user", id: session.user.id },
    headers: requestHeaders,
  })

  invalidateUserCache(session.user.id)
  return { success: true as const }
}
