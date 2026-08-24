import { S3Client } from "@aws-sdk/client-s3"
import { db } from "@dimah-s3/db"
import { dimahS3, errors } from "@dimah-s3/server"
import { auth } from "@repo/auth"
import { dimahS3Db } from "@repo/db/dimah-s3"
import { toOwnerPrefix } from "./keys"
import { toStorageScope, type StorageOwner } from "./owner"
import { resolveOwner } from "./owner/resolve"

export const awsS3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

function isUnderOwner(key: string, owner: StorageOwner) {
  const prefix = toOwnerPrefix(owner)
  return key === prefix || key.startsWith(`${prefix}/`)
}

async function requireOwner(request: Request, key?: string) {
  const owner = await resolveOwner(request, key)
  if (!owner) throw errors.unauthorized()
  return owner
}

/** Upload: stamp `{kind}/{id}/` onto `{purpose}/{fileName}`. */
async function ownerPrefix({
  request,
  proposedKey,
}: {
  request: Request
  proposedKey: string
}) {
  const owner = await requireOwner(request, proposedKey)
  return toOwnerPrefix(owner)
}

/** Upload: reject a nested `user/` or `org/` under the stamped prefix. */
async function assertComposedUploadKey({
  request,
  key,
}: {
  request: Request
  key: string
}) {
  const owner = await requireOwner(request, key)
  if (!isUnderOwner(key, owner)) throw errors.forbidden()

  const rest = key.slice(toOwnerPrefix(owner).length + 1)
  const [purpose] = rest.split("/")
  if (purpose === "user" || purpose === "org") throw errors.forbidden()
}

/** Download / delete: authorize a stored canonical key; do not rewrite. */
async function assertOwnedKey({
  request,
  key,
}: {
  request: Request
  key: string
}) {
  const owner = await requireOwner(request, key)
  if (!isUnderOwner(key, owner)) throw errors.forbidden()
}

const assertPolicy = { guard: assertOwnedKey }

export const s3 = dimahS3({
  client: awsS3,
  bucket: process.env.S3_BUCKET!,
  guard: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) throw errors.unauthorized()
  },
  upload: {
    method: "PUT",
    requireFileSize: true,
    prefix: ownerPrefix,
    guard: assertComposedUploadKey,
    // later: chain a quota guard here
  },
  download: assertPolicy,
  delete: assertPolicy,

  plugins: [
    db({
      client: dimahS3Db,
      resolveScope: async (request) => {
        const owner = await resolveOwner(request)
        return owner ? toStorageScope(owner) : null
      },
    }),
  ],
})
