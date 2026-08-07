/** Ownership kinds shared by object keys (`user/…`) and DB scopes (`user:…`). */

export type StorageOwnerKind = "user" | "org"

export type StorageOwner = { kind: StorageOwnerKind; id: string }

/** DB ownership string — colon form (`user:abc`, `org:xyz`). */
export function toStorageScope(owner: StorageOwner): string {
  return `${owner.kind}:${owner.id}`
}

/** Parse a stored scope back into a typed owner. */
export function parseStorageScope(scope: string): StorageOwner | null {
  const [kind, id] = scope.split(":")
  if ((kind !== "user" && kind !== "org") || !id) return null
  return { kind, id }
}
