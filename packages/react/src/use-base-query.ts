// useBaseQuery.ts
import { useState, useEffect, useSyncExternalStore, useCallback, useRef } from 'react'
import { QueryObserver, UseBaseQueryResult, UseBaseQueryOptions, QueryKey, QueryClient } from '@the-tanstack-query/core'

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

  // 缓存 getSnapshot 的结果，避免无限循环
  const lastSnapshotRef = useRef<UseBaseQueryResult<TData, TError>>()
  
  const getSnapshot = useCallback(() => {
    const currentResult = observer.getCurrentResult()
    
    // 如果结果没有实际变化，返回缓存的结果以保持引用稳定性
    if (lastSnapshotRef.current) {
      const prev = lastSnapshotRef.current
      if (
        prev.data === currentResult.data &&
        prev.isLoading === currentResult.isLoading &&
        prev.isError === currentResult.isError &&
        prev.error === currentResult.error
      ) {
        return lastSnapshotRef.current
      }
    }
    
    lastSnapshotRef.current = currentResult
    return currentResult
  }, [observer])

  // 使用 useSyncExternalStore 来订阅状态变化
  const result = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        // 订阅，为了当状态更新时通知组件重新渲染
        const unsubscribe = observer.subscribe(onStoreChange)
        return unsubscribe
      },
      [observer],
    ),
    getSnapshot, // getSnapshot
    getSnapshot, // getServerSnapshot (SSR support)
  )

  useEffect(() => {
    // 更新选项并发起请求
    observer.setOptions(options)
    observer.fetchOptimistic()
  }, [options, observer])

  return result
}
