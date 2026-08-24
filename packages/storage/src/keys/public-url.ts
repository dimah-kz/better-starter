function publicBaseUrl(): string | null {
  const base = process.env.S3_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "")
  return base || null
}

/** Public URL for an object key. Returns null when `S3_PUBLIC_BASE_URL` is unset. */
export function publicUrl(key: string): string | null {
  const base = publicBaseUrl()
  if (!base) return null
  return `${base}/${key.replace(/^\/+/, "")}`
}

/** Reverse of {@link publicUrl}; null when URL is not under our public base. */
export function objectKeyFromPublicUrl(url: string): string | null {
  const base = publicBaseUrl()
  if (!base) return null
  const prefix = `${base}/`
  if (!url.startsWith(prefix)) return null
  const key = url.slice(prefix.length).replace(/^\/+/, "")
  return key || null
}
