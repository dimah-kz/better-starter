import { S3Client } from "@aws-sdk/client-s3"
import { db } from "@dimah-s3/db"
import { dimahS3, errors } from "@dimah-s3/server"
import { dimahS3Db } from "@repo/db/dimah-s3"
import { toOwnerScope } from "./owner"
import {
  composeObjectKey,
  getRequestAuth,
  resolveOwner,
  resolveStoredOwner,
} from "./owner/resolve"

export const awsS3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

async function assertOwnedObject({
  request,
  key,
}: {
  request: Request
  key: string
}) {
  if (!(await resolveStoredOwner(request, key))) throw errors.forbidden()
}

export const s3 = dimahS3({
  client: awsS3,
  bucket: process.env.S3_BUCKET!,
  guard: async ({ request }) => {
    const { session } = await getRequestAuth(request)
    if (!session) throw errors.unauthorized()
  },
  upload: {
    method: "PUT",
    requireFileSize: true,
    resolveKey: async ({ request, proposedKey }) => {
      const key = await composeObjectKey(request, proposedKey)
      if (!key) throw errors.forbidden()
      return key
    },
    guard: assertOwnedObject,
    // later: chain a quota guard here
  },
  download: { guard: assertOwnedObject },
  delete: { guard: assertOwnedObject },

  plugins: [
    db({
      client: dimahS3Db,
      resolveScope: async (request) => {
        const owner = await resolveOwner(request)
        return owner ? toOwnerScope(owner) : null
      },
    }),
  ],
})
