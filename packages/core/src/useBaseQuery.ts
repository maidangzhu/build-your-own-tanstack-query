// useBaseQuery.ts
import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { QueryObserver } from './queryObserver'
import { UseBaseQueryResult, UseBaseQueryOptions, QueryKey } from './types'
import type { QueryClient } from './query-client'

export function useBaseQuery<
  TError = Error,
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  client: QueryClient,
  options: UseBaseQueryOptions<TData, TQueryKey>,
): UseBaseQueryResult<TData, TError> {
  // 在整个组件生命周期中保持 `QueryObserver` 唯一
  const [observer] = useState(
    () => new QueryObserver<TData, TError, TQueryKey>(client, options),
  )

  // 获取查询结果
  const result = observer.getOptimisticResult(options)

  useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        // 订阅，为了当状态更新时通知组件重新渲染
        const unsubscribe = observer.subscribe(onStoreChange)
        return unsubscribe
      },
      [observer],
    ),
    // 可以看到useSyncExternalStore没有用到返回值，所以其实这里就是为了满足类型要求
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult(),
  )

  useEffect(() => {
    // 更新选项并发起请求
    observer.setOptions(options)
    observer.fetchOptimistic()
  }, [options, observer])

  return result
}
