import { List as ListRoot, ListEmpty, ListFooter } from "./list"
import { ListFilter } from "./list-filter"
import { ListPagination } from "./list-pagination"
import { ListSearch, type ListSearchProps } from "./list-search"
import { ListSkeleton } from "./list-skeleton"

const List = Object.assign(ListRoot, {
  Footer: ListFooter,
  Empty: ListEmpty,
  Search: ListSearch,
  Filter: ListFilter,
  Pagination: ListPagination,
  Skeleton: ListSkeleton,
})

export {
  List,
  ListEmpty,
  ListFilter,
  ListFooter,
  ListPagination,
  ListSearch,
  ListSkeleton,
}

export { useList } from "./use-list"

export {
  buildListSearchParams,
  clampListPage,
  listPath,
  parseListEnumFilter,
  parseListFilter,
  parseListPage,
  parseListPageSize,
  parseListQuery,
} from "./params"

export {
  LIST_PAGE_SIZES,
  type ListFilterOption,
  type ListPaginationProps,
  type ListSearchParamsInput,
} from "./types"

export type { ListSearchProps }
