export const locales = ["en", "fa"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeCookieName = "BS_LOCALE"

export const directions = {
  en: "ltr",
  fa: "rtl",
} as const satisfies Record<string, "ltr" | "rtl">

export const i18nConfig = {
  locales,
  defaultLocale,
  localeCookieName,
  directions,
} as const

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (value && isValidLocale(value)) {
    return value
  }

  return defaultLocale
}

export function resolveLocaleFromHeaders(headers: {
  get(name: string): string | null
}): Locale {
  for (const part of (headers.get("cookie") ?? "").split(";")) {
    const [name, ...rest] = part.trim().split("=")

    if (name === localeCookieName) {
      return resolveLocale(decodeURIComponent(rest.join("=")))
    }
  }

  return defaultLocale
}

export function getLocaleDirection(
  locale: Locale
): (typeof directions)[keyof typeof directions] {
  return directions[locale as keyof typeof directions] ?? directions.en
}
