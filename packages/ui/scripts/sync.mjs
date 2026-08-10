import path from "node:path"
import { fileURLToPath } from "node:url"

import { blank, done, formatRepo, heading } from "./lib/cli.mjs"
import { syncReui } from "./reui/sync.mjs"
import { syncShadcn } from "./sync-shadcn.mjs"

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(uiRoot, "../..")

const started = Date.now()
heading("ui:sync")

syncShadcn({ skipFormat: true })
blank()
syncReui({ skipFormat: true })
blank()
formatRepo({ cwd: repoRoot })

done(Date.now() - started)
