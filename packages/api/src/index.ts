import { createRouterClient, onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import type { RpcContext } from "./base"
import { rpcPrefix } from "./prefix"
import { router } from "./router"

export { rpcPrefix } from "./prefix"
export { router } from "./router"
export type { RpcContext } from "./base"

export type Router = typeof router

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export function createCaller(
  context: RpcContext | (() => RpcContext | Promise<RpcContext>)
) {
  return createRouterClient(router, { context })
}

export async function handleRpcRequest(request: Request): Promise<Response> {
  const { response } = await rpcHandler.handle(request, {
    prefix: rpcPrefix,
    context: { headers: request.headers },
  })

  return response ?? new Response("Not found", { status: 404 })
}
