import { S3Client } from "@aws-sdk/client-s3"
import { db } from "@dimah-s3/db"
import { dimahS3, errors } from "@dimah-s3/server"
import { auth } from "@repo/auth"
import { dimahS3Db } from "@repo/db/dimah-s3"
import { toStorageScope } from "./owner"
import { resolveOwner } from "./owner/resolve"

export const awsS3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

/**
 * Force keys under `{kind}/{id}/`. Already-scoped keys (confirm / download /
 * delete) pass through. A different owner's prefix is rejected, not nested.
 */
async function resolveOwnedKey({
  request,
  proposedKey,
}: {
  request: Request
  proposedKey: string
}) {
  const owner = await resolveOwner(request, proposedKey)
  if (!owner) throw errors.unauthorized()

  const prefix = `${owner.kind}/${owner.id}`
  const key = proposedKey.replace(/^\/+/u, "")

  if (key === prefix || key.startsWith(`${prefix}/`)) return key

  const [root] = key.split("/")
  if (root === "user" || root === "org") throw errors.forbidden()

  return `${prefix}/${key}`
}

const keyPolicy = { resolveKey: resolveOwnedKey }

export const s3 = dimahS3({
  client: awsS3,
  bucket: process.env.S3_BUCKET!,
  plugins: [
    db({
      client: dimahS3Db,
      resolveScope: async (request) => {
        const owner = await resolveOwner(request)
        return owner ? toStorageScope(owner) : null
      },
    }),
  ],
  guard: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) throw errors.unauthorized()
  },
  upload: {
    method: "PUT",
    requireFileSize: true,
    ...keyPolicy,
    // later: guard: chainHooks(createQuotaGuard({ resolveOwner, s3: () => s3 }))
  },
  download: keyPolicy,
  delete: keyPolicy,
})
