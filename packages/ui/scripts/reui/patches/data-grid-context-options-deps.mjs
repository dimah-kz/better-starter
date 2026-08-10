/** @type {import("./index.mjs").UiPatch} */
export const patch = {
  id: "data-grid-context-options-deps",
  file: "src/components/reui/data-grid/data-grid.tsx",
  apply(source) {
    if (source.includes("table.options.data,")) {
      return { status: "already-applied", source }
    }

    const from = `      tableState.globalFilter,
    ]`
    const to = `      tableState.globalFilter,
      // local override: refresh rows when useTable options change (updateTag / RSC)
      table.options.data,
      table.options.columns,
      table.options.rowCount,
    ]`

    if (!source.includes(from)) {
      throw new Error(`[${this.id}] anchor missing in ${this.file}`)
    }

    return { status: "applied", source: source.replace(from, to) }
  },
}
