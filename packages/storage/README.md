# @repo/storage

[dimah-s3](https://dimah-s3.vercel.app) storage — named routes in `s3.ts`, scoped to a user or organization.

To add a route: register it on `dimahS3({ routes })` and on `DimahS3Routes` in `s3-client.tsx`. Keep owner identity as `{kind}/{id}` under the route prefix so stored keys still map back to a session.

Needs the `S3_*` env vars from `.env.example`.
