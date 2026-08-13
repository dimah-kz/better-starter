import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { done, heading, ok } from "../../lib/cli.mjs"

/**
 * @typedef {{
 *   id: string
 *   file: string
 *   apply: (source: string) => { status: "applied" | "already-applied"; source: string }
 * }} UiPatch
 */

/**
 * @typedef {{
 *   id: string
 *   file: string
 *   status: "applied" | "already-applied"
 * }} UiPatchResult
 */

/** @type {UiPatch[]} */
export const patches = []

/** Normalized paths (posix) of files that carry local ReUI overrides. */
export function getOverrideFiles() {
  return [...new Set(patches.map((patch) => patch.file.replace(/\\/g, "/")))]
}

/**
 * @param {string} uiRoot
 * @returns {UiPatchResult[]}
 */
export function applyReuiPatches(uiRoot) {
  /** @type {UiPatchResult[]} */
  const results = []

  for (const patch of patches) {
    const target = path.join(uiRoot, patch.file)
    if (!fs.existsSync(target)) {
      throw new Error(`[patch:${patch.id}] missing ${patch.file}`)
    }

    const before = fs.readFileSync(target, "utf8")
    const { status, source } = patch.apply(before)

    if (status === "applied") {
      fs.writeFileSync(target, source, "utf8")
    }

    results.push({
      id: patch.id,
      file: patch.file.replace(/\\/g, "/"),
      status,
    })
  }

  return results
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const started = Date.now()
  heading("ui:sync · patches")
  const results = applyReuiPatches(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
  )
  for (const result of results) {
    const short = result.file.replace(/^src\/components\//, "")
    ok(
      "override",
      result.status === "applied"
        ? `${short} ← ${result.id}`
        : `${short} already present`
    )
  }
  done(Date.now() - started)
}
