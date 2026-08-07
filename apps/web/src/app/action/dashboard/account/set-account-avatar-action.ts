"use server"

import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { isAvatarKey } from "@/lib/avatar-storage"
import { deleteOwnedAvatarObject } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { auth, getAuthApiErrorMessage } from "@better-starter/auth"
import { buildPublicUrl } from "@better-starter/storage"

export async function setAccountAvatarAction(key: string) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return { error: "Unauthorized" as const }
  }

  const owner = { kind: "user" as const, id: session.user.id }
  if (!isAvatarKey(key, owner)) {
    return { error: "Invalid avatar key" as const }
  }

  const imageUrl = buildPublicUrl(key)
  if (!imageUrl) {
    return { error: "Public storage URL is not configured" as const }
  }

  try {
    await auth.api.updateUser({
      headers: requestHeaders,
      body: { image: imageUrl },
    })
  } catch (error) {
    return { error: getAuthApiErrorMessage(error) }
  }

  await deleteOwnedAvatarObject({
    previousUrl: session.user.image,
    owner,
    headers: requestHeaders,
    exceptKey: key,
  })

  invalidateUserCache(session.user.id)
  return { success: true as const, imageUrl }
}
