import { isAvatarKey } from "@/lib/avatar-storage"
import {
  objectKeyFromPublicUrl,
  s3,
  type StorageOwner,
} from "@repo/storage"

/** Best-effort delete of a previous owned avatar object (after profile/org link update). */
export async function deleteOwnedAvatarObject(options: {
  previousUrl: string | null | undefined
  owner: StorageOwner
  headers: Headers
  exceptKey?: string
}) {
  const previousKey = options.previousUrl
    ? objectKeyFromPublicUrl(options.previousUrl)
    : null

  if (
    !previousKey ||
    previousKey === options.exceptKey ||
    !isAvatarKey(previousKey, options.owner)
  ) {
    return
  }

  try {
    await s3.api.delete(previousKey, { headers: options.headers })
  } catch {
    // Best-effort — the new/cleared image is already linked.
  }
}
