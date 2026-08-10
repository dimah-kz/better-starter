import type { Messages } from "@repo/i18n"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof import("@repo/i18n"))["locales"][number]
    Messages: Messages
  }
}
