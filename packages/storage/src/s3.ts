import { S3Client } from "@aws-sdk/client-s3"
import { db } from "@dimah-s3/db"
import { dimahS3, errors } from "@dimah-s3/server"
import { chainHooks } from "@dimah-s3/server/plugins"
import { auth } from "@repo/auth"
import { dimahS3Db } from "@repo/db/dimah-s3"
import { createKeyOwnershipGuard } from "./hooks"
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

const keyOwnershipGuard = createKeyOwnershipGuard({ resolveOwner })

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
    guard: chainHooks(
      keyOwnershipGuard
      // later: createQuotaGuard({ resolveOwner, s3: () => s3 })
    ),
  },
  multipart: {
    initGuard: chainHooks(
      keyOwnershipGuard
      // later: createQuotaGuard({ resolveOwner, s3: () => s3 })
    ),
  },
  download: true,
  delete: true,
})
