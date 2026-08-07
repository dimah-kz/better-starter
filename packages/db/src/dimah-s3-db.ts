import { DimahS3DB } from "@dimah-s3/db"
import { drizzleAdapter } from "fumadb/adapters/drizzle"
import { db } from "./client"

export const dimahS3Db = DimahS3DB.client(
  drizzleAdapter({ db, provider: "postgresql" })
)
