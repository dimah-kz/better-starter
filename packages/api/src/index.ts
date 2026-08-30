import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { prefix } from "./prefix"
import { router } from "./router"

export { createRouterClient } from "@orpc/server"
export { router }

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export async function handleRequest(request: Request): Promise<Response> {
  const { response } = await handler.handle(request, {
    prefix,
    context: { headers: request.headers },
  })

  return response ?? new Response("Not found", { status: 404 })
}
