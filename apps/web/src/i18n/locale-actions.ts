"use server"

import {
  isValidLocale,
  localeCookieName,
  type Locale,
} from "@better-starter/i18n"
import { cookies } from "next/headers"

export async function setLocale(locale: Locale) {
  if (!isValidLocale(locale)) {
    return
  }

  const store = await cookies()
  store.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  })
}
