// useQuery.ts
import { QueryKey, UseBaseQueryOptions, UseBaseQueryResult } from './types'
import { useBaseQuery } from './useBaseQuery'
import type { QueryClient } from './query-client'

export function useQuery<
  TError = Error, // `useQuery` 返回的 `error` 的类型
  TData = unknown, // `useQuery` 返回的 `data` 的类型
  TQueryKey extends QueryKey = QueryKey, // `queryKey` 的类型
>(
  client: QueryClient,
  options: UseBaseQueryOptions<TData, TQueryKey>
): UseBaseQueryResult<TData, TError> {
  return useBaseQuery(client, options)
}
