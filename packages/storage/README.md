# @better-starter/storage

S3 client, dimah-s3 server instance (`dimahS3` + `@dimah-s3/db` plugin), Fuma translations (`en` / `fa`), and React provider.

- Server: `import { s3, s3Client, defaultBucket } from "@better-starter/storage"`
- Route: `toNextJsHandler(s3)` from `@dimah-s3/server/next` at `app/api/s3/[...s3]/route.ts`
- Client provider: `import { S3ClientProvider, api, useApi } from "@better-starter/storage/react"`
- Client-safe helpers: `import { toObjectKey, buildPublicUrl } from "@better-starter/storage/keys"`
- Client hooks: `useUpload` / `useDelete` / `useDownload` from `@dimah-s3/react` (same `S3Provider` tree)
- UI: `@dimah-s3/ui` via `@workspace/ui` when needed
- DB: `storage_object` schema + `dimahS3Db` in `@better-starter/db`

## Layout

| Path                          | Role                                              |
| ----------------------------- | ------------------------------------------------- |
| `s3.ts` / `s3-client.ts`      | Server instance + AWS client                      |
| `react.tsx` / `translations/` | Client provider + Fuma locale maps                |
| `owner/scope.ts`              | Types + scope encode/decode (client-safe)         |
| `owner/resolve.ts`            | Session/key → owner (server; auth)                |
| `owner/index.ts`              | Re-exports scope helpers                          |
| `keys/`                       | Object key + public URL helpers                   |
| `hooks/upload/`               | Upload/multipart guards (`chainHooks` in `s3.ts`) |

## Translations

dimah-s3 uses [Fuma Translate](https://translate.fuma-nama.dev/) — English source strings with context notes become keys like `"Upload failed(toast)"`. Add locales under `translations/` with `satisfies Partial<Translations>` and wire them in `translations/index.ts`.

## Features

Upload (simple + multipart), download, and delete are enabled. The db plugin enforces scope on existing rows; `createKeyOwnershipGuard` also blocks first-write key spoofing on upload presign and multipart init.

Add new structural guards under `hooks/` (e.g. `hooks/upload/quota.ts`) and stack them with `chainHooks`. Feature logic (avatar, …) stays in the app.

## Scope and object key

| Layer                    | Format                             | Example                       |
| ------------------------ | ---------------------------------- | ----------------------------- |
| **Scope** (DB ownership) | `{kind}:{id}`                      | `user:abc`, `org:xyz`         |
| **Object key** (S3 path) | `{kind}/{id}/{purpose}/{fileName}` | `user/abc/avatars/photo.webp` |

`resolveOwner` prefers the owner implied by the key when it matches the caller (`user/{self}` or `org/{activeOrg}`); otherwise session context (`activeOrganizationId` → org, else user).

**Purpose** strings are kebab-case. Allowed purposes stay app SSOT — only format is validated here.

Same owner + purpose + file name → same key (overwrite). Pass a distinct `fileName` when you need uniqueness.
