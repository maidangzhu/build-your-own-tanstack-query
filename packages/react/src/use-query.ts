import { useQuery as useQueryCore, UseBaseQueryOptions, UseBaseQueryResult, QueryKey } from '@the-tanstack-query/core'
import { useQueryClient } from './query-client-provider'

export function useQuery<
  TError = Error,
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseBaseQueryOptions<TData, TQueryKey>
): UseBaseQueryResult<TData, TError> {
  const client = useQueryClient()
  return useQueryCore(client, options)
} 