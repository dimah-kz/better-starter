import { auth, type Session } from "@repo/auth"
import { objectKey, parseObjectKey, parseUploadKey } from "../keys/object-key"
import { isOwnerKind, type StorageOwner, type StorageOwnerKind } from "./scope"

type RequestAuth = {
  session: Session | null
  key: string | null
  ownerKind: StorageOwnerKind | null
}

const authByRequest = new WeakMap<Request, Promise<RequestAuth>>()

function loadAuth(request: Request): Promise<RequestAuth> {
  let pending = authByRequest.get(request)
  if (!pending) {
    pending = (async () => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return { session: null, key: null, ownerKind: null }
      const intent = await peekIntent(request)
      return { session, ...intent }
    })()
    authByRequest.set(request, pending)
  }
  return pending
}

function ownerFromKind(
  session: Session,
  kind: StorageOwnerKind
): StorageOwner | null {
  if (kind === "user") return { kind: "user", id: session.user.id }
  const id = session.session.activeOrganizationId
  return id ? { kind: "org", id } : null
}

/** Active organization if set; otherwise the signed-in user. */
function workspaceOwner(session: Session): StorageOwner {
  return session.session.activeOrganizationId
    ? { kind: "org", id: session.session.activeOrganizationId }
    : { kind: "user", id: session.user.id }
}

function ownedBySession(session: Session, owner: StorageOwner): boolean {
  if (owner.kind === "user") return owner.id === session.user.id
  return owner.id === session.session.activeOrganizationId
}

async function peekIntent(request: Request): Promise<{
  key: string | null
  ownerKind: StorageOwnerKind | null
}> {
  const url = new URL(request.url)
  const ownerKind = url.searchParams.get("owner")
  const keyFromQuery = url.searchParams.get("key")

  try {
    const body = (await request.clone().json()) as { key?: unknown }
    return {
      key: keyFromQuery ?? (typeof body.key === "string" ? body.key : null),
      ownerKind: isOwnerKind(ownerKind) ? ownerKind : null,
    }
  } catch {
    return {
      key: keyFromQuery,
      ownerKind: isOwnerKind(ownerKind) ? ownerKind : null,
    }
  }
}

function ownerFromKey(session: Session, key: string): StorageOwner | null {
  const stored = parseObjectKey(key)
  if (stored && ownedBySession(session, stored.owner)) return stored.owner

  const upload = parseUploadKey(key)
  return upload ? ownerFromKind(session, upload.kind) : null
}

/**
 * Upload: insert session `id` into `{kind}/{purpose}/{fileName}`.
 * Confirm: leave a stored canonical key unchanged.
 */
export async function resolveComposedKey(
  request: Request,
  proposedKey: string
): Promise<string | null> {
  const { session } = await loadAuth(request)
  if (!session) return null

  const stored = parseObjectKey(proposedKey)
  if (stored && ownedBySession(session, stored.owner)) return proposedKey

  const upload = parseUploadKey(proposedKey)
  if (!upload) return null
  const owner = ownerFromKind(session, upload.kind)
  if (!owner) return null
  return objectKey(owner, upload.purpose, upload.fileName)
}

/** Download / delete: authorize the stored key; do not rewrite it. */
export async function resolveStoredOwner(
  request: Request,
  key: string
): Promise<StorageOwner | null> {
  const { session } = await loadAuth(request)
  if (!session) return null

  const stored = parseObjectKey(key)
  if (!stored || !ownedBySession(session, stored.owner)) return null
  return stored.owner
}

/** DB listings: owner from the object key, else `?owner=`, else the workspace. */
export async function resolveRequestOwner(
  request: Request
): Promise<StorageOwner | null> {
  const { session, key, ownerKind } = await loadAuth(request)
  if (!session) return null
  if (key) {
    const fromKey = ownerFromKey(session, key)
    if (fromKey) return fromKey
  }
  if (ownerKind) return ownerFromKind(session, ownerKind)
  return workspaceOwner(session)
}
