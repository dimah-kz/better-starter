import { DimahS3Error, S3_ERROR_CODES } from "@dimah-s3/core"
import type { StorageOwner } from "../../owner"

/** Shared by upload.guard and multipart.initGuard (first-write key check). */
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
    if (!owner) {
      throw DimahS3Error.from("UNAUTHORIZED", S3_ERROR_CODES.UNAUTHORIZED)
    }

    const [kind, id, purpose] = key.split("/")
    if (kind !== owner.kind || id !== owner.id) {
      throw DimahS3Error.from("FORBIDDEN", {
        ...S3_ERROR_CODES.FORBIDDEN,
        message: "Key does not match caller scope",
      })
    }
    if (
      options.allowedPurposes &&
      (!purpose || !options.allowedPurposes.includes(purpose))
    ) {
      throw DimahS3Error.from("FORBIDDEN", {
        ...S3_ERROR_CODES.FORBIDDEN,
        message: `Storage purpose "${purpose ?? ""}" is not allowed`,
      })
    }
  }
}
