import { 
  QueryKey, 
  UseBaseQueryOptions, 
  UseBaseQueryResult
} from '@the-tanstack-query/core'
import { useQueryClient } from './query-client-provider'
import { useQuery as coreUseQuery } from './use-query-core'

// React 版本的 useQuery hook
export function useQuery<
  TError = Error,
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseBaseQueryOptions<TData, TQueryKey>
): UseBaseQueryResult<TData, TError> {
  // 从 Context 中获取 QueryClient
  const queryClient = useQueryClient()
  
  // 调用核心库的 useQuery
  return coreUseQuery<TError, TData, TQueryKey>(queryClient, options)
}

