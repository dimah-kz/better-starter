import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

type ListSkeletonProps = {
  className?: string
  columns?: number
  rows?: number
}

export function ListSkeleton({
  className,
  columns = 4,
  rows = 5,
}: ListSkeletonProps) {
  return (
    <Table
      data-slot="list-skeleton"
      className={cn(className)}
      aria-busy="true"
      aria-live="polite"
    >
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }, (_, index) => (
            <TableHead key={index} aria-hidden>
              <Skeleton className="h-3 w-20 max-w-full rounded-sm" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={rowIndex} aria-hidden>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <TableCell key={columnIndex}>
                <Skeleton className="h-4 w-full max-w-48 rounded-sm" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
