import { DimahS3Error } from "@dimah-s3/core"
import type { StorageOwner } from "../../owner"

/** Shared by upload.presignGuard and multipart.initGuard (first-write key check). */
export type KeyOwnershipContext = {
  request: Request
  key: string
}

/**
 * Rejects first-write keys outside the caller's owner prefix.
 * The db plugin only checks existing rows — this closes the empty-key spoof hole.
 */
export function createKeyOwnershipGuard(options: {
  resolveOwner: (request: Request, key: string) => Promise<StorageOwner | null>
  allowedPurposes?: readonly string[]
}) {
  return async ({ request, key }: KeyOwnershipContext) => {
    const owner = await options.resolveOwner(request, key)
    if (!owner) throw new DimahS3Error("Unauthorized", 401)

    const [kind, id, purpose] = key.split("/")
    if (kind !== owner.kind || id !== owner.id) {
      throw new DimahS3Error("Key does not match caller scope", 403)
    }
    if (
      options.allowedPurposes &&
      (!purpose || !options.allowedPurposes.includes(purpose))
    ) {
      throw new DimahS3Error(
        `Storage purpose "${purpose ?? ""}" is not allowed`,
        403
      )
    }
  }
}
