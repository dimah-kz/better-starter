/** Tenancy kinds used in object keys (`user/…`) and DB scopes (`user:…`). */

export type OwnerKind = "user" | "org"

export type Owner = { kind: OwnerKind; id: string }

export function isOwnerKind(value: unknown): value is OwnerKind {
  return value === "user" || value === "org"
}

/** DB plugin scope — colon form (`user:abc`, `org:xyz`). */
export function toOwnerScope(owner: Owner): string {
  return `${owner.kind}:${owner.id}`
}

export function parseOwnerScope(scope: string): Owner | null {
  const [kind, id] = scope.split(":")
  if (!isOwnerKind(kind) || !id) return null
  return { kind, id }
}
