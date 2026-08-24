/** Tenancy kinds used in object keys (`user/…`) and DB scopes (`user:…`). */

export type StorageOwnerKind = "user" | "org"

export type StorageOwner = { kind: StorageOwnerKind; id: string }

export function isOwnerKind(value: unknown): value is StorageOwnerKind {
  return value === "user" || value === "org"
}

/** DB plugin scope — colon form (`user:abc`, `org:xyz`). */
export function toOwnerScope(owner: StorageOwner): string {
  return `${owner.kind}:${owner.id}`
}

export function parseOwnerScope(scope: string): StorageOwner | null {
  const [kind, id] = scope.split(":")
  if (!isOwnerKind(kind) || !id) return null
  return { kind, id }
}
