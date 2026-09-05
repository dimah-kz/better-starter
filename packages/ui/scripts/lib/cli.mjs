import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { intro, log, outro } from "@clack/prompts"
import pc from "picocolors"

const skipDirs = new Set(["node_modules", ".git", ".next", "dist"])
const cnUtilsRe = /^export\s*\{\s*cn\s*\}\s*from\s*["'](?:cn|cnfast)["']\s*;?$/

/**
 * Official shadcn components import `cn` from the `cn` package.
 * Drop the local wrapper and rewrite leftover `@repo/ui/lib/utils` imports.
 * @param {string} root
 */
export function usePackageCn(root) {
  const rewritten = rewriteCnImports(root)
  const removed = removeLocalCnUtils(root)
  if (rewritten === 0 && !removed) return

  const parts = []
  if (rewritten > 0) {
    parts.push(`${rewritten} import${rewritten === 1 ? "" : "s"}`)
  }
  if (removed) parts.push("removed lib/utils.ts")
  ok("cn", parts.join(" · "))
}

/** @param {string} root */
function rewriteCnImports(root) {
  const localUtils = ["@repo/ui/lib/utils", "@/lib/utils"]
  let count = 0
  for (const file of walkSourceFiles(root)) {
    const before = fs.readFileSync(file, "utf8")
    let after = before
    for (const spec of localUtils) {
      after = after.replaceAll(`from "${spec}"`, 'from "cn"')
      after = after.replaceAll(`from '${spec}'`, 'from "cn"')
    }
    after = after.replace(
      /(from ["'][^"']+["']\r?\n)\r?\nimport \{ cn \} from "cn"/g,
      '$1import { cn } from "cn"'
    )
    if (after === before) continue
    fs.writeFileSync(file, after)
    count += 1
  }
  return count
}

/** @param {string} root */
function removeLocalCnUtils(root) {
  const file = path.join(root, "src/lib/utils.ts")
  if (!fs.existsSync(file)) return false
  if (!cnUtilsRe.test(fs.readFileSync(file, "utf8").trim())) return false
  fs.unlinkSync(file)
  const dir = path.dirname(file)
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir)
  }
  return true
}

/** @param {string} root */
function walkSourceFiles(root) {
  const src = path.join(root, "src")
  const start = fs.existsSync(src) ? src : root
  /** @type {string[]} */
  const files = []
  /** @param {string} dir */
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skipDirs.has(entry.name)) continue
      const next = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(next)
        continue
      }
      if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) files.push(next)
    }
  }
  walk(start)
  return files
}

export function blank() {
  console.log()
}

/** @param {string} title */
export function heading(title) {
  intro(title)
}

/** @param {string} label @param {string} [detail] */
export function step(label, detail = "") {
  log.step(line(label, detail))
}

/** @param {string} label @param {string} [detail] */
export function ok(label, detail = "") {
  log.success(line(label, detail))
}

/** @param {string} label @param {string} [detail] */
export function warn(label, detail = "") {
  log.warn(line(label, detail))
}

/** @param {string} label @param {string} [detail] */
export function fail(label, detail = "") {
  log.error(line(label, detail))
}

/** @param {number} elapsedMs */
export function done(elapsedMs) {
  const secs = (elapsedMs / 1000).toFixed(elapsedMs >= 10_000 ? 0 : 1)
  outro(`done in ${secs}s`)
}

/**
 * @param {string} text
 * @returns {{ updated: string[]; skipped: number }}
 */
export function parseShadcnOutput(text) {
  const lines = text.split(/\r?\n/)
  /** @type {string[]} */
  const updated = []
  /** @type {string[]} */
  const extras = []
  let skipped = 0
  let mode = null

  for (const lineText of lines) {
    if (/Updated\s+\d+\s+files?/i.test(lineText)) {
      mode = "updated"
      continue
    }

    const skippedMatch = lineText.match(/Skipped\s+(\d+)\s+files?/i)
    if (skippedMatch) {
      skipped = Number(skippedMatch[1])
      mode = "skipped"
      continue
    }

    const fileMatch = lineText.match(
      /^\s*-\s+(.+\.(?:tsx?|jsx?|css|mjs|cjs))$/i
    )
    if (fileMatch && mode === "updated") {
      updated.push(normalizePath(fileMatch[1].trim()))
      continue
    }
    if (fileMatch && mode === "skipped") continue

    if (/Updating\s+.+\.css/i.test(lineText)) {
      extras.push(
        normalizePath(lineText.replace(/^.*?Updating\s+/i, "").trim())
      )
      mode = null
      continue
    }

    if (
      /Checking registry|Installing dependencies|Remember to wrap/i.test(
        lineText
      ) ||
      /The `?.+`? component has been added/i.test(lineText)
    ) {
      mode = null
    }
  }

  return {
    updated: [...updated, ...extras.filter((f) => !updated.includes(f))],
    skipped,
  }
}

/**
 * @param {{ updated: string[]; skipped: number; overridden?: string[] }} summary
 */
export function formatSyncSummary(summary) {
  const parts = [
    `${summary.updated.length} updated`,
    `${summary.skipped} unchanged`,
  ]
  if ((summary.overridden?.length ?? 0) > 0) {
    parts.push(`${summary.overridden.length} override`)
  }
  return parts.join(" · ")
}

/**
 * @param {string[]} updated
 * @param {string[]} overrideFiles
 */
export function classifyOverrides(updated, overrideFiles) {
  const overrideSet = new Set(overrideFiles.map(normalizePath))
  /** @type {string[]} */
  const plain = []
  /** @type {string[]} */
  const overridden = []

  for (const file of updated) {
    const normalized = normalizePath(file)
    if (overrideSet.has(normalized)) overridden.push(normalized)
    else plain.push(normalized)
  }

  return { updated: plain, overridden }
}

/**
 * @param {string[]} args
 * @param {{ cwd: string }} opts
 */
export function runPnpm(args, { cwd }) {
  const env = {
    ...process.env,
    FORCE_COLOR: "0",
    NO_COLOR: "1",
  }

  // Windows .cmd shims need a shell. Pass one command string (no args array)
  // to avoid Node DEP0190.
  const result =
    process.platform === "win32"
      ? spawnSync(["pnpm", ...args].map(quoteArg).join(" "), {
          cwd,
          encoding: "utf8",
          shell: true,
          env,
        })
      : spawnSync("pnpm", args, {
          cwd,
          encoding: "utf8",
          shell: false,
          env,
        })

  const stdout = result.stdout ?? ""
  const stderr = result.stderr ?? ""
  const combined = `${stdout}${stderr}`

  if (result.error) {
    fail("exec", result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    fail("failed", `exit ${result.status ?? 1}`)
    if (combined.trim()) log.message(pc.dim(combined.trimEnd()))
    process.exit(result.status ?? 1)
  }

  return { stdout, stderr, combined }
}

/** @param {{ cwd: string }} opts */
export function formatRepo({ cwd }) {
  step("format", "prettier…")
  runPnpm(["exec", "prettier", "--write", ".", "--log-level", "warn"], {
    cwd,
  })
  ok("format", "done")
}

/** @param {string} label @param {string} detail */
function line(label, detail) {
  const head = label.padEnd(12)
  return detail ? `${head}${pc.dim(detail)}` : head
}

/** @param {string} value */
function quoteArg(value) {
  if (value.length === 0) return '""'
  if (/[\s"&<>|^]/.test(value)) return `"${value.replace(/"/g, '\\"')}"`
  return value
}

/** @param {string} value */
function normalizePath(value) {
  return value.replace(/\\/g, "/")
}
