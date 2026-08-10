"use server"

import { invalidateUserCache } from "@/app/dashboard/lib/invalidate-user-cache"
import { deleteOwnedAvatarObject } from "@/lib/delete-owned-avatar"
import { headers } from "next/headers"
import { auth, getAuthApiErrorMessage } from "@repo/auth"

export async function removeAccountAvatarAction() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return { error: "Unauthorized" as const }
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

  await deleteOwnedAvatarObject({
    previousUrl,
    owner: { kind: "user", id: session.user.id },
    headers: requestHeaders,
  })

  invalidateUserCache(session.user.id)
  return { success: true as const }
}
