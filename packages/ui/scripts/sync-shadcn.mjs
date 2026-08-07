import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(uiRoot, "../..")

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run(
  "pnpm",
  ["dlx", "shadcn@latest", "add", "--all", "--overwrite", "--yes"],
  uiRoot
)
run("pnpm", ["format"], repoRoot)
