import {
  getLocaleDirection,
  loadMessages,
  resolveLocaleFromHeaders,
} from "@better-starter/i18n"
import { headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
  const locale = resolveLocaleFromHeaders(await headers())
  const messages = loadMessages(locale)

  return {
    locale,
    messages,
    direction: getLocaleDirection(locale),
  }
})
