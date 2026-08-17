import { toNextJsHandler } from "@dimah-s3/server/next"
import { s3 } from "@repo/storage"

export const { GET, POST, PUT, PATCH, DELETE } = toNextJsHandler(s3)
