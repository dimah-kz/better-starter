import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: "../../.env" })

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/schema/auth.schema.ts", "./src/schema/dimah-s3.schema.ts"],
  out: "./drizzle",
  schemaFilter: ["auth", "storage"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
