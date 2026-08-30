import { ORPCError, os } from "@orpc/server"
import { auth } from "@repo/auth"

export const pub = os.$context<{ headers: Headers }>()

export const authed = pub.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers })

  if (!session) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({ context: { session } })
})
