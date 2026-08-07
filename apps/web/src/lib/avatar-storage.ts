import { toObjectKey, type StorageOwner } from "@better-starter/storage/keys"

export const AVATAR_PURPOSE = "avatars"
export const AVATAR_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export function toAvatarKey(owner: StorageOwner, fileName: string) {
  return toObjectKey(owner, AVATAR_PURPOSE, fileName)
}

export function isAvatarKey(key: string, owner: StorageOwner) {
  const [kind, id, purpose] = key.split("/")
  return kind === owner.kind && id === owner.id && purpose === AVATAR_PURPOSE
}
