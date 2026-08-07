# @better-starter/auth

Authentication for the monorepo: Better Auth with email/password, admin, and organizations.

Owns the auth server config, session helpers, and permission surfaces. Apps mutate through `auth.api` — not by talking to auth tables directly.
