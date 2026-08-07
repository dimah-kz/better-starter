import type { Translations } from "@dimah-s3/react"
import type { Locale } from "@better-starter/i18n"
import { fa } from "./fa"

export type { Translations }

/** Fuma locale map for `S3Provider` — omit `en` to use English source keys. */
export const translationsByLocale: Record<
  Locale,
  Partial<Translations> | undefined
> = {
  en: undefined,
  fa,
}
