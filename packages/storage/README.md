# @repo/storage

[dimah-s3](https://dimah-s3.vercel.app) storage for the monorepo — uploads with ownership scoped to a user or organization.

Apps use it for avatars, org logos, and similar assets. This package wires the dimah-s3 server, React provider, and key helpers so ownership stays consistent across clients.

Needs the `S3_*` env vars from `.env.example` (any S3-compatible bucket, e.g. Cloudflare R2).

Object keys are `{kind}/{id}/{purpose}/{fileName}`. The client proposes `{purpose}/{fileName}` plus owner kind (`user` | `org`). Upload `prefix` stamps `{kind}/{id}/`. Download and delete authorize the stored key and do not rewrite it.
