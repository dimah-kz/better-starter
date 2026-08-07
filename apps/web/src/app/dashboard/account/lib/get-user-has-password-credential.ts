import { and, eq, isNotNull } from "@better-starter/db/drizzle"
import { account } from "@better-starter/db/schema"
import { db } from "@better-starter/db"

const CREDENTIAL_PROVIDER_ID = "credential"

export async function getUserHasPasswordCredential(userId: string) {
  const [row] = await db
    .select({ id: account.id })
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, CREDENTIAL_PROVIDER_ID),
        isNotNull(account.password)
      )
    )
    .limit(1)

  return row != null
}
