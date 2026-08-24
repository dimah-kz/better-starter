import { sanitizeFileName } from "@dimah-s3/core"
import { isOwnerKind, type StorageOwner, type StorageOwnerKind } from "../owner"

/**
 * Canonical: `{kind}/{id}/{purpose}/{fileName}`
 * Upload:    `{kind}/{purpose}/{fileName}` — server inserts `id` from the session.
 *
 * Purpose is an app label (`avatars`, later `attachments`, …), never `user` | `org`.
 *
 * `build*` assembles a key · `parse*` splits it · `is*` matches owner/purpose.
 */
export type ObjectKeyParts = {
  owner: StorageOwner
  purpose: string
  fileName: string
}

export type UploadKeyParts = {
  kind: StorageOwnerKind
  purpose: string
  fileName: string
}

/** Defensive format check only — app-level allowlists live beside the feature. */
const PURPOSE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function isPurpose(value: string): boolean {
  return PURPOSE_PATTERN.test(value) && !isOwnerKind(value)
}

/** Keep the original name, but strip path separators so the key stays under purpose/. */
function safeFileName(fileName: string): string {
  const base = sanitizeFileName(fileName)
    .replace(/[/\\]+/g, "_")
    .replace(/^\.+/, "_")
    .trim()
  return base || "file"
}

function purposePath(purpose: string, fileName: string): string {
  if (!isPurpose(purpose)) {
    throw new Error(`Invalid storage purpose: "${purpose}"`)
  }
  return `${purpose}/${safeFileName(fileName)}`
}

function ownedBy(parts: ObjectKeyParts, owner: StorageOwner): boolean {
  return parts.owner.kind === owner.kind && parts.owner.id === owner.id
}

/** `{kind}/{id}` */
export function buildOwnerPrefix(owner: StorageOwner): string {
  return `${owner.kind}/${owner.id}`
}

/** `{kind}/{purpose}/{fileName}` — kind only, never an id. */
export function buildUploadKey(
  kind: StorageOwnerKind,
  purpose: string,
  fileName: string
): string {
  return `${kind}/${purposePath(purpose, fileName)}`
}

/** `{kind}/{id}/{purpose}/{fileName}` */
export function buildObjectKey(
  owner: StorageOwner,
  purpose: string,
  fileName: string
): string {
  return `${buildOwnerPrefix(owner)}/${purposePath(purpose, fileName)}`
}

export function parseUploadKey(key: string): UploadKeyParts | null {
  const [kind, purpose, ...rest] = key.split("/")
  const fileName = rest.join("/")
  if (!isOwnerKind(kind) || !purpose || !isPurpose(purpose) || !fileName) {
    return null
  }
  return { kind, purpose, fileName }
}

export function parseObjectKey(key: string): ObjectKeyParts | null {
  const [kind, id, purpose, ...rest] = key.split("/")
  const fileName = rest.join("/")
  if (
    !isOwnerKind(kind) ||
    !id ||
    !purpose ||
    !isPurpose(purpose) ||
    !fileName
  ) {
    return null
  }
  return { owner: { kind, id }, purpose, fileName }
}

export function isOwnedKey(key: string, owner: StorageOwner): boolean {
  const parsed = parseObjectKey(key)
  return parsed !== null && ownedBy(parsed, owner)
}

export function isObjectKeyFor(
  key: string,
  owner: StorageOwner,
  purpose: string
): boolean {
  const parsed = parseObjectKey(key)
  return parsed !== null && ownedBy(parsed, owner) && parsed.purpose === purpose
}
