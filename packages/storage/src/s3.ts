import { db } from "@dimah-s3/db"
import { dimahS3, chainHooks } from "@dimah-s3/server"
import { auth } from "@better-starter/auth"
import { dimahS3Db } from "@better-starter/db/dimah-s3"
import { createKeyOwnershipGuard } from "./hooks"
import { toStorageScope } from "./owner"
import { resolveOwner } from "./owner/resolve"
import { defaultBucket, s3Client } from "./s3-client"

const keyOwnershipGuard = createKeyOwnershipGuard({ resolveOwner })

export const s3 = dimahS3({
  s3: s3Client,
  defaultBucket,
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
    if (!session) {
      throw Object.assign(new Error("Unauthorized"), { status: 401 })
    }
  },
  upload: {
    enabled: true,
    presignGuard: chainHooks(
      keyOwnershipGuard
      // later: createQuotaGuard({ resolveOwner, s3: () => s3 })
    ),
  },
  multipart: {
    enabled: true,
    initGuard: chainHooks(
      keyOwnershipGuard
      // later: createQuotaGuard({ resolveOwner, s3: () => s3 })
    ),
  },
  download: { enabled: true },
  delete: { enabled: true },
})
