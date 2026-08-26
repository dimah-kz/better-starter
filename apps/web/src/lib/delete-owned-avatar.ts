import { fromPublicUrl, objectKeyMatches, s3, type Owner } from "@repo/storage"

/** Best-effort delete of a previous owned avatar (after profile/org link update). */
export async function deleteOwnedAvatar(options: {
  previousUrl: string | null | undefined
  owner: Owner
  headers: Headers
  exceptKey?: string
}) {
  const previousKey = options.previousUrl
    ? fromPublicUrl(options.previousUrl)
    : null

  if (
    !previousKey ||
    previousKey === options.exceptKey ||
    !objectKeyMatches(previousKey, options.owner, "avatars")
  ) {
    return
  }

  try {
    await s3.api.delete({
      query: { key: previousKey },
      headers: options.headers,
    })
  } catch {
    // Best-effort — the new/cleared image is already linked.
  }
}
