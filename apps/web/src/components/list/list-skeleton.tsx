import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card"
import { Skeleton } from "@repo/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table"

const ROW_COUNT = 5
const COLUMN_COUNT = 4

export function ListSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <CardAction>
          <Skeleton className="h-8 w-full sm:max-w-xs" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: COLUMN_COUNT }, (_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ROW_COUNT }, (_, row) => (
              <TableRow key={row}>
                {Array.from({ length: COLUMN_COUNT }, (_, column) => (
                  <TableCell key={column}>
                    <Skeleton
                      className={column === 0 ? "h-8 w-40" : "h-4 w-20"}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-6 w-full" />
      </CardFooter>
    </Card>
  )
}
