import { cacheLife, cacheTag } from "next/cache"
import { eq } from "@better-starter/db/drizzle"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { user } from "@better-starter/db/schema"
import { db } from "@better-starter/db"

export async function getAccountProfile(userId: string) {
  "use cache"

  cacheLife("minutes")
  cacheTag(dashboardCacheTags.userProfileById(userId))

  const [profile] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  return profile ?? null
}
