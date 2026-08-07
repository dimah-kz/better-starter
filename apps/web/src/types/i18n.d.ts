import type { Messages } from "@better-starter/i18n"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof import("@better-starter/i18n"))["locales"][number]
    Messages: Messages
  }
}
