# @repo/storage

[dimah-s3](https://dimah-s3.vercel.app) storage for the monorepo — uploads scoped to a user or organization.

Apps use it for avatars, org logos, and similar assets. Object keys are `{kind}/{id}/{purpose}/{fileName}`. The client sends `buildUploadKey("user" | "org", purpose, fileName)` — kind only, never an id. The server inserts `{id}` from the session. Download and delete authorize the stored key and do not rewrite it.

Needs the `S3_*` env vars from `.env.example` (any S3-compatible bucket, e.g. Cloudflare R2).
