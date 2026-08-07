import { toNextJsHandler } from "@dimah-s3/server/next"
import { s3 } from "@better-starter/storage"

export const { GET, POST, DELETE } = toNextJsHandler(s3)
