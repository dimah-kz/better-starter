const DEFAULT_REDIRECT = "/dashboard"

export function normalizeAuthRedirectTarget(
  value: string | null | undefined,
  fallback = DEFAULT_REDIRECT
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  return value
}
