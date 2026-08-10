import { createColumnHelper, type RowData } from "@tanstack/react-table"
import type { DataGridFeatures } from "@repo/ui/components/reui/data-grid/data-grid"

export function createDataGridColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataGridFeatures, TData>()
}
