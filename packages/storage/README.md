# @repo/storage

[dimah-s3](https://dimah-s3.vercel.app) storage — uploads scoped to a user or organization.

Object keys are `{kind}/{id}/{purpose}/{fileName}` (`toObjectKey` / `parseObjectKey`). The client passes kind only; the server inserts `{id}` from the session. Download and delete authorize the stored key and do not rewrite it.

Needs the `S3_*` env vars from `.env.example`, including `S3_PUBLIC_BASE_URL` for avatar/logo URLs.
