import { auth, type Session } from "@repo/auth"
import {
  parseObjectKey,
  toObjectKey,
  type ObjectKeyParts,
} from "../keys/object-key"
import { isOwnerKind, type Owner, type OwnerKind } from "./scope"

function ownerOf(session: Session, kind: OwnerKind): Owner | null {
  if (kind === "user") return { kind: "user", id: session.user.id }
  const id = session.session.activeOrganizationId
  return id ? { kind: "org", id } : null
}

function matchingOwner(session: Session, parts: ObjectKeyParts): Owner | null {
  const owner = ownerOf(session, parts.kind)
  if (!owner || (parts.id && parts.id !== owner.id)) return null
  return owner
}

async function peekRequest(request: Request): Promise<{
  key: string | null
  kind: OwnerKind | null
}> {
  const url = new URL(request.url)
  const kindParam = url.searchParams.get("owner")
  const kind = isOwnerKind(kindParam) ? kindParam : null
  const keyFromQuery = url.searchParams.get("key")

  try {
    const body = (await request.clone().json()) as { key?: unknown }
    return {
      key: keyFromQuery ?? (typeof body.key === "string" ? body.key : null),
      kind,
    }
  } catch {
    return { key: keyFromQuery, kind }
  }
}

/** Upload: insert session `id` into a proposed key. Confirm: leave a stored key unchanged. */
export async function completeObjectKey(
  request: Request,
  proposedKey: string
): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const parts = parseObjectKey(proposedKey)
  if (!parts) return null
  const owner = matchingOwner(session, parts)
  if (!owner) return null
  return parts.id
    ? proposedKey
    : toObjectKey(owner, parts.purpose, parts.fileName)
}

/** Download / delete: authorize the stored key; do not rewrite it. */
export async function ownerOfKey(
  request: Request,
  key: string
): Promise<Owner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const parts = parseObjectKey(key)
  if (!parts?.id) return null
  return matchingOwner(session, parts)
}

/** DB listings: owner from the object key, else `?owner=`, else the workspace. */
export async function resolveOwner(request: Request): Promise<Owner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const { key, kind } = await peekRequest(request)
  if (key) {
    const parts = parseObjectKey(key)
    const fromKey = parts ? matchingOwner(session, parts) : null
    if (fromKey) return fromKey
  }
  return ownerOf(
    session,
    kind ?? (session.session.activeOrganizationId ? "org" : "user")
  )
}
