import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { authRelations } from "./schema/auth.schema"
import { storageRelations } from "./schema/dimah-s3.schema"

config({ path: "../../.env" })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle({
  client: pool,
  relations: { ...authRelations, ...storageRelations },
})
export { pool }
