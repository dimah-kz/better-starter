import { sanitizeFileName } from "@dimah-s3/core"
import { isOwnerKind, type StorageOwner, type StorageOwnerKind } from "../owner"

/**
 * `{kind}/{id}/{purpose}/{fileName}` — `id` is omitted on client proposals;
 * the server fills it from the session. Purpose is an app label (`avatars`,
 * later `attachments`, …), never `user` | `org`.
 */
export type ObjectKeyParts = {
  kind: StorageOwnerKind
  id?: string
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

/** Client: pass `kind` only. Server: pass `StorageOwner` (includes id). */
export function buildObjectKey(
  owner: StorageOwnerKind | StorageOwner,
  purpose: string,
  fileName: string
): string {
  const kind = typeof owner === "string" ? owner : owner.kind
  const id = typeof owner === "string" ? undefined : owner.id
  const rest = purposePath(purpose, fileName)
  return id ? `${kind}/${id}/${rest}` : `${kind}/${rest}`
}

export function parseObjectKey(key: string): ObjectKeyParts | null {
  const [kind, second, third, ...rest] = key.split("/")
  if (!isOwnerKind(kind) || !second) return null

  const storedName = rest.join("/")
  if (third && isPurpose(third) && storedName) {
    return { kind, id: second, purpose: third, fileName: storedName }
  }

  const proposedName = [third, ...rest].join("/")
  if (isPurpose(second) && proposedName) {
    return { kind, purpose: second, fileName: proposedName }
  }

  return null
}

export function isObjectKeyFor(
  key: string,
  owner: StorageOwner,
  purpose: string
): boolean {
  const parsed = parseObjectKey(key)
  return (
    parsed !== null &&
    parsed.kind === owner.kind &&
    parsed.id === owner.id &&
    parsed.purpose === purpose
  )
}
