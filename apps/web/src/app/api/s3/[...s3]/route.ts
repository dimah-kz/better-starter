import { toNextJsHandler } from "@dimah-s3/server/next"
import { s3 } from "@repo/storage"

export const { GET, POST, DELETE } = toNextJsHandler(s3)
