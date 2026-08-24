import { auth, type Session } from "@repo/auth"
import {
  buildObjectKey,
  parseObjectKey,
  type ObjectKeyParts,
} from "../keys/object-key"
import { isOwnerKind, type StorageOwner, type StorageOwnerKind } from "./scope"

function ownerFromKind(
  session: Session,
  kind: StorageOwnerKind
): StorageOwner | null {
  if (kind === "user") return { kind: "user", id: session.user.id }
  const id = session.session.activeOrganizationId
  return id ? { kind: "org", id } : null
}

function sessionOwner(
  session: Session,
  parts: ObjectKeyParts
): StorageOwner | null {
  const owner = ownerFromKind(session, parts.kind)
  if (!owner || (parts.id && parts.id !== owner.id)) return null
  return owner
}

async function peekIntent(request: Request): Promise<{
  key: string | null
  ownerKind: StorageOwnerKind | null
}> {
  const url = new URL(request.url)
  const rawOwner = url.searchParams.get("owner")
  const ownerKind = isOwnerKind(rawOwner) ? rawOwner : null
  const keyFromQuery = url.searchParams.get("key")

  try {
    const body = (await request.clone().json()) as { key?: unknown }
    return {
      key: keyFromQuery ?? (typeof body.key === "string" ? body.key : null),
      ownerKind,
    }
  } catch {
    return { key: keyFromQuery, ownerKind }
  }
}

/**
 * Upload: insert session `id` into a proposed key.
 * Confirm: leave a stored key unchanged.
 */
export async function composeObjectKey(
  request: Request,
  proposedKey: string
): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const parts = parseObjectKey(proposedKey)
  if (!parts) return null
  const owner = sessionOwner(session, parts)
  if (!owner) return null
  return parts.id
    ? proposedKey
    : buildObjectKey(owner, parts.purpose, parts.fileName)
}

/** Download / delete: authorize the stored key; do not rewrite it. */
export async function resolveStoredOwner(
  request: Request,
  key: string
): Promise<StorageOwner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const parts = parseObjectKey(key)
  if (!parts?.id) return null
  return sessionOwner(session, parts)
}

/** DB listings: owner from the object key, else `?owner=`, else the workspace. */
export async function resolveOwner(
  request: Request
): Promise<StorageOwner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const { key, ownerKind } = await peekIntent(request)
  if (key) {
    const parts = parseObjectKey(key)
    const fromKey = parts ? sessionOwner(session, parts) : null
    if (fromKey) return fromKey
  }
  return ownerFromKind(
    session,
    ownerKind ?? (session.session.activeOrganizationId ? "org" : "user")
  )
}
