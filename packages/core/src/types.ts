// 核心类型定义
export type QueryKey = ReadonlyArray<unknown>
export type QueryStatus = 'pending' | 'success' | 'error'

export interface QueryState<TData = unknown, TError = Error> {
  status: QueryStatus
  data: TData | undefined
  error: TError | null
  isFetching: boolean
}

// Query 相关类型
export interface QueryOptions<TData = unknown, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey
  queryFn: () => Promise<TData>
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
}

// Hook 相关类型
export interface UseBaseQueryOptions<TData = unknown, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey
  queryFn: () => Promise<TData>
  enabled?: boolean
}

export interface UseBaseQueryResult<TData = unknown, TError = Error> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  refetch: () => void
}

// QueryCache 和 Query 类型前向声明
export interface Query<TData = unknown, TError = Error> {
  queryKey: QueryKey
  queryHash: string
  state: QueryState<TData, TError>
  fetch(): Promise<void>
}

export interface QueryCache {
  get(queryHash: string): Query | undefined
  add(query: Query): void
  build(options: QueryOptions): Query
} 