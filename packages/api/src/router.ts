import * as z from "zod"
import { pub } from "./base"

const ping = pub
  .output(z.object({ ok: z.literal(true) }))
  .handler(async () => ({ ok: true as const }))

export const router = {
  health: {
    ping,
  },
}
