import { createORPCClient as createClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { prefix } from "./prefix"
import type { router } from "./router"

export function createORPCClient(options: {
  origin: string
  headers?:
    Headers | Record<string, string> | (() => Headers | Promise<Headers>)
}): RouterClient<typeof router> {
  const link = new RPCLink({
    origin: options.origin,
    url: prefix,
    headers: options.headers,
  })

  return createClient(link)
}
