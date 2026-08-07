export function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function isPathActive(
  pathname: string,
  href: string,
  options?: { exactMatchHref?: string }
) {
  const path = normalizePathname(pathname)
  const url = normalizePathname(href)

  if (options?.exactMatchHref && url === options.exactMatchHref) {
    return path === url
  }

  return path === url || path.startsWith(`${url}/`)
}

export function resolveActiveTabKey<T extends string>(
  pathname: string,
  tabs: readonly { key: T; pathSuffix: string }[],
  fallback: T
): T {
  const match = [...tabs]
    .reverse()
    .find((tab) => pathname.includes(tab.pathSuffix))

  return match?.key ?? fallback
}

export function matchesPathPrefix(pathname: string, prefix: string) {
  const path = normalizePathname(pathname)
  const normalizedPrefix = normalizePathname(prefix)

  return path === normalizedPrefix || path.startsWith(`${normalizedPrefix}/`)
}
