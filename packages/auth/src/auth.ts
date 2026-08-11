import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2"
import { i18n, locales as authErrorLocales } from "@better-auth/i18n"
import { nextCookies } from "better-auth/next-js"
import type { AccessControl } from "better-auth/plugins/access"
import { admin, lastLoginMethod, organization } from "better-auth/plugins"
import { db } from "@repo/db"
import * as schema from "@repo/db/schema"
import { defaultLocale, localeCookieName } from "@repo/i18n"
import { adminPluginAc, adminPluginRoles } from "./admin-access"
import { orgAc, orgRoles } from "./organization-access"

export const auth = betterAuth({
  experimental: { joins: true },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    schemaName: "auth",
  }),
  session: {
    freshAge: 0,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac: adminPluginAc as AccessControl,
      roles: adminPluginRoles,
    }),
    organization({
      ac: orgAc as AccessControl,
      roles: orgRoles,
    }),
    i18n({
      translations: {
        en: authErrorLocales.en,
        fa: authErrorLocales.fa,
      },
      defaultLocale,
      detection: ["cookie", "header"],
      localeCookie: localeCookieName,
    }),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    nextCookies(),
  ],
})

/** Non-null session payload from `auth.api.getSession` / `$Infer.Session`. */
export type Session = typeof auth.$Infer.Session
