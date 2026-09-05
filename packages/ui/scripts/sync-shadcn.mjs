import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  blank,
  done,
  formatRepo,
  formatSyncSummary,
  heading,
  ok,
  parseShadcnOutput,
  runPnpm,
  step,
} from "./lib/cli.mjs"

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(uiRoot, "../..")

/**
 * @param {{ skipFormat?: boolean }} [opts]
 */
export function syncShadcn(opts = {}) {
  step("shadcn", "updating…")
  const { combined } = runPnpm(
    ["dlx", "shadcn@latest", "add", "--all", "--overwrite", "--yes"],
    { cwd: uiRoot }
  )

  const summary = parseShadcnOutput(combined)
  ok("shadcn", formatSyncSummary(summary))

  if (!opts.skipFormat) {
    blank()
    formatRepo({ cwd: repoRoot })
  }

  return summary
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const started = Date.now()
  heading("ui:sync · shadcn")
  syncShadcn()
  done(Date.now() - started)
}
