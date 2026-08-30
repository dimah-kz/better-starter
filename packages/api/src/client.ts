import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { rpcPrefix } from "./prefix"
import type { router } from "./router"

export function createHttpClient(options: {
  origin: string
  headers?:
    Headers | Record<string, string> | (() => Headers | Promise<Headers>)
}): RouterClient<typeof router> {
  const link = new RPCLink({
    origin: options.origin,
    url: rpcPrefix,
    headers: options.headers,
  })

  return createORPCClient(link)
}
