import { buildObjectKey, sanitizeFileName } from "@dimah-s3/core"
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

/**
 * S3 key — slash form aligned with scope:
 * `{kind}/{id}/{purpose}/{fileName}`
 */
export function toObjectKey(
  owner: StorageOwner,
  purpose: string,
  fileName: string
): string {
  if (!PURPOSE_PATTERN.test(purpose)) {
    throw new Error(`Invalid storage purpose: "${purpose}"`)
  }
  return buildObjectKey(owner.kind, owner.id, purpose, safeFileName(fileName))
}
