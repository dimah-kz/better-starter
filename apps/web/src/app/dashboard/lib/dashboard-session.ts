import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { authRoutes } from "@/app/(auth)/lib/auth-routes"
import { normalizeAuthRedirectTarget } from "@/app/(auth)/lib/auth-redirect"
import { auth } from "@repo/auth"

/** Redirects unauthenticated visitors to login; returns the session otherwise. */
export async function requireDashboardSession() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    const params = new URLSearchParams({
      redirect: normalizeAuthRedirectTarget("/dashboard"),
    })
    redirect(`${authRoutes.login()}?${params.toString()}`)
  }

  return session
}

/** Organizations the signed-in user belongs to (for switcher / nav). */
export const listDashboardOrganizations = cache(async () => {
  return auth.api.listOrganizations({ headers: await headers() })
})

/** Set session active org via Better Auth — authorization enforced by the API. */
export async function setDashboardActiveOrganization(organizationId: string) {
  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: { organizationId },
  })
}

/** Unset active org — personal account context. */
export async function clearDashboardActiveOrganization() {
  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: { organizationId: null },
  })
}

/**
 * Session active org when the user is still a member. `null` means personal
 * account (explicit user choice). Only heals stale ids — never auto-selects
 * the first membership when active org is intentionally unset.
 */
export const resolveDashboardActiveOrganizationId = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return null
  }

  const activeOrganizationId = session.session.activeOrganizationId ?? null

  if (activeOrganizationId === null) {
    return null
  }

  const organizations = await listDashboardOrganizations()
  const membershipIds = new Set(
    organizations.map((organization) => organization.id)
  )

  if (membershipIds.has(activeOrganizationId)) {
    return activeOrganizationId
  }

  const firstOrganization = organizations[0]

  if (firstOrganization?.id) {
    await setDashboardActiveOrganization(firstOrganization.id)
    return firstOrganization.id
  }

  await clearDashboardActiveOrganization()
  return null
})
