import { auth, type Session } from "@repo/auth"
import { isOwnerKind, type Owner, type OwnerKind } from "./scope"

function ownerOf(session: Session, kind: OwnerKind): Owner | null {
  if (kind === "user") return { kind: "user", id: session.user.id }
  const id = session.session.activeOrganizationId
  return id ? { kind: "org", id } : null
}

/** `{keyPrefix}/{kind}/{id}/…` — same folder `object()` writes for every route. */
function ownerFromKey(key: string): Owner | null {
  const [, kind, id] = key.split("/")
  if (!isOwnerKind(kind) || !id) return null
  return { kind, id }
}

async function peekRequest(request: Request): Promise<{
  key: string | null
  ownerKind: OwnerKind | null
}> {
  const url = new URL(request.url)
  const kindParam = url.searchParams.get("owner")
  const ownerKind = isOwnerKind(kindParam) ? kindParam : null
  const keyFromQuery = url.searchParams.get("key")

  try {
    const body = (await request.clone().json()) as {
      key?: unknown
      metadata?: { ownerKind?: unknown }
    }
    const metaKind = isOwnerKind(body.metadata?.ownerKind)
      ? body.metadata.ownerKind
      : null
    return {
      key: keyFromQuery ?? (typeof body.key === "string" ? body.key : null),
      ownerKind: metaKind ?? ownerKind,
    }
  } catch {
    return { key: keyFromQuery, ownerKind }
  }
}

/** DB plugin + `upload.object`: owner from a stored key, else client `ownerKind`. */
export async function resolveOwner(request: Request): Promise<Owner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const { key, ownerKind } = await peekRequest(request)
  if (key) {
    const parsed = ownerFromKey(key)
    if (parsed) {
      const current = ownerOf(session, parsed.kind)
      if (current?.id === parsed.id) return current
    }
  }
  return ownerOf(session, ownerKind ?? "user")
}
