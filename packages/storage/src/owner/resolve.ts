import { auth, type Session } from "@better-starter/auth"
import type { StorageOwner } from "./scope"

/**
 * Active organization wins; otherwise the user owns the upload.
 * Aligns with Better Auth `session.activeOrganizationId` as current context.
 */
function ownerFromSession(session: Session): StorageOwner {
  return session.session.activeOrganizationId
    ? { kind: "org", id: session.session.activeOrganizationId }
    : { kind: "user", id: session.user.id }
}

async function peekObjectKey(request: Request): Promise<string | null> {
  const fromQuery = new URL(request.url).searchParams.get("key")
  if (fromQuery) return fromQuery
  try {
    const body = (await request.clone().json()) as { key?: unknown }
    return typeof body.key === "string" ? body.key : null
  } catch {
    return null
  }
}

/**
 * Prefer owner implied by the object key when it matches the caller
 * (`user/{self}/…` or `org/{activeOrg}/…`); otherwise session context.
 */
export async function resolveOwner(
  request: Request,
  key?: string | null
): Promise<StorageOwner | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return null

  const objectKey = key ?? (await peekObjectKey(request))
  if (objectKey) {
    const [kind, id] = objectKey.split("/")
    if (kind === "user" && id === session.user.id) {
      return { kind: "user", id }
    }
    if (kind === "org" && id && id === session.session.activeOrganizationId) {
      return { kind: "org", id }
    }
  }

  return ownerFromSession(session)
}
