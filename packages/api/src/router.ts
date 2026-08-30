import { pub } from "./base"

const ping = pub.handler(async () => ({ ok: true as const }))

export const router = {
  health: {
    ping,
  },
}
