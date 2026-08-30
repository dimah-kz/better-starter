# @repo/api

Product-domain [oRPC](https://orpc.dev) v2 procedures. Web calls them with `createRouterClient`; HTTP is `handleRequest` at `/api/rpc`. Other clients use `createORPCClient` from `@repo/api/client`.

Auth stays in `@repo/auth` (`auth.api`). Add procedures here; do not wrap Better Auth.
