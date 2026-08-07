import { cacheLife, cacheTag } from "next/cache"
import { eq } from "@better-starter/db/drizzle"
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags"
import { organization } from "@better-starter/db/schema"
import { db } from "@better-starter/db"

export type OrganizationBranding = {
  id: string
  name: string
  logo: string | null
}

export async function getActiveOrganizationBranding(organizationId: string) {
  "use cache"

  cacheLife("minutes")
  cacheTag(dashboardCacheTags.organizationBrandingById(organizationId))

  const [branding] = await db
    .select({
      id: organization.id,
      name: organization.name,
      logo: organization.logo,
    })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1)

  return branding ?? null
}
