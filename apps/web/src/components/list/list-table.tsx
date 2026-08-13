import type { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table"
import { cn } from "@repo/ui/lib/utils"
import type { ListColumn } from "@/components/list/types"

export type ListTableProps<T> = {
  rows: T[]
  columns: ListColumn<T>[]
  getRowId: (row: T) => string
  empty?: ReactNode
}

export function ListTable<T>({
  rows,
  columns,
  getRowId,
  empty,
}: ListTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(column.className, column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={Math.max(columns.length, 1)}
              className="py-6 text-center whitespace-normal text-muted-foreground"
            >
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(column.className, column.cellClassName)}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
