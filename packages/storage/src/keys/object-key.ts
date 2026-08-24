import { sanitizeFileName } from "@dimah-s3/core"
import type { StorageOwner } from "../owner"

/** Defensive format check only — app-level allowlists live beside the feature. */
const PURPOSE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Keep the original name, but strip path separators so the key stays under purpose/. */
function safeFileName(fileName: string): string {
  const base = sanitizeFileName(fileName)
    .replace(/[/\\]+/g, "_")
    .replace(/^\.+/, "_")
    .trim()
  return base || "file"
}

/** Owner tenancy prefix: `{kind}/{id}`. */
export function toOwnerPrefix(owner: StorageOwner): string {
  return `${owner.kind}/${owner.id}`
}

/**
 * Client-proposed key for upload:
 * `{purpose}/{fileName}`
 */
export function toRelativeKey(purpose: string, fileName: string): string {
  if (!PURPOSE_PATTERN.test(purpose)) {
    throw new Error(`Invalid storage purpose: "${purpose}"`)
  }
  return `${purpose}/${safeFileName(fileName)}`
}

/**
 * Canonical S3 key:
 * `{kind}/{id}/{purpose}/{fileName}`
 */
export function toObjectKey(
  owner: StorageOwner,
  purpose: string,
  fileName: string
): string {
  return `${toOwnerPrefix(owner)}/${toRelativeKey(purpose, fileName)}`
}

export function isObjectKeyFor(
  key: string,
  owner: StorageOwner,
  purpose: string
): boolean {
  const [kind, id, keyPurpose] = key.split("/")
  return kind === owner.kind && id === owner.id && keyPurpose === purpose
}
