import { auth, type Session } from "@repo/auth"
import type { StorageOwner, StorageOwnerKind } from "./scope"

/**
 * Active organization wins; otherwise the user owns the upload.
 * Aligns with Better Auth `session.activeOrganizationId` as current context.
 */
function ownerFromSession(session: Session): StorageOwner {
  return session.session.activeOrganizationId
    ? { kind: "org", id: session.session.activeOrganizationId }
    : { kind: "user", id: session.user.id }
}

function ownerFromKind(
  session: Session,
  kind: StorageOwnerKind
): StorageOwner | null {
  if (kind === "user") return { kind: "user", id: session.user.id }
  const id = session.session.activeOrganizationId
  if (!id) return null
  return { kind: "org", id }
}

function parseOwnerKind(value: unknown): StorageOwnerKind | null {
  return value === "user" || value === "org" ? value : null
}

function ownerFromKey(
  session: Session,
  key: string
): StorageOwner | null {
  const [kind, id] = key.split("/")
  if (kind === "user" && id === session.user.id) {
    return { kind: "user", id }
  }
  if (kind === "org" && id && id === session.session.activeOrganizationId) {
    return { kind: "org", id }
  }
  return null
}

type RequestIntent = {
  key: string | null
  ownerKind: StorageOwnerKind | null
}

async function peekIntent(request: Request): Promise<RequestIntent> {
  const url = new URL(request.url)
  const ownerKind =
    parseOwnerKind(url.searchParams.get("owner")) ??
    parseOwnerKind(url.searchParams.get("ownerKind"))
  const keyFromQuery = url.searchParams.get("key")

  try {
    const body = (await request.clone().json()) as {
      key?: unknown
      owner?: unknown
      ownerKind?: unknown
      metadata?: { owner?: unknown }
    }
    return {
      key: keyFromQuery ?? (typeof body.key === "string" ? body.key : null),
      ownerKind:
        ownerKind ??
        parseOwnerKind(body.owner) ??
        parseOwnerKind(body.ownerKind) ??
        parseOwnerKind(body.metadata?.owner),
    }
  } catch {
    return { key: keyFromQuery, ownerKind }
  }
}

/**
 * Owner for a request: matching canonical key, then explicit `user` | `org`
 * intent, then session context.
 */
export async function resolveOwner(
  request: Request,
  key?: string | null
): Promise<StorageOwner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const intent = await peekIntent(request)
  const objectKey = key ?? intent.key
  if (objectKey) {
    const fromKey = ownerFromKey(session, objectKey)
    if (fromKey) return fromKey
  }

  if (intent.ownerKind) return ownerFromKind(session, intent.ownerKind)

  return ownerFromSession(session)
}
