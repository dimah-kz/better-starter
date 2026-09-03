import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"

export const DEFAULT_AUTH_REDIRECT = dashboardRoutes.home()

export function normalizeAuthRedirectTarget(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  return value
}
