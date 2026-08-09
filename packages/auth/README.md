# @better-starter/auth

Authentication for the monorepo: [Better Auth](https://www.better-auth.com/) with email/password, `admin`, `organization`, and `lastLoginMethod` (`storeInDatabase: true`) plugins.

Owns the auth server config, session helpers, and permission surfaces. Apps mutate through `auth.api` — never by talking to auth tables directly.

After changing auth config, regenerate schema from the db package: `auth:generate` → `db:generate` → `db:migrate`.
