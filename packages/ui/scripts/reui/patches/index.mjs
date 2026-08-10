import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { patch as dataGridContextOptionsDeps } from "./data-grid-context-options-deps.mjs"

/**
 * @typedef {{
 *   id: string
 *   file: string
 *   apply: (source: string) => { status: "applied" | "already-applied"; source: string }
 * }} UiPatch
 */

/** @type {UiPatch[]} */
export const patches = [dataGridContextOptionsDeps]

export function applyReuiPatches(uiRoot) {
  for (const patch of patches) {
    const target = path.join(uiRoot, patch.file)
    if (!fs.existsSync(target)) {
      throw new Error(`[patch:${patch.id}] missing ${patch.file}`)
    }

    const before = fs.readFileSync(target, "utf8")
    const { status, source } = patch.apply(before)

    if (status === "applied") {
      fs.writeFileSync(target, source, "utf8")
      console.log(`✔ patch ${patch.id}`)
    } else {
      console.log(`· patch ${patch.id} already present`)
    }
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  applyReuiPatches(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
  )
}
