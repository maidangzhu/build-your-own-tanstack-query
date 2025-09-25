// useBaseQuery.ts
import { useState, useEffect, useSyncExternalStore, useCallback, useRef, useMemo } from 'react'
import { QueryObserver, UseBaseQueryResult, UseBaseQueryOptions, QueryKey, QueryClient } from '@the-tanstack-query/core'

export function useBaseQuery<
  TError = Error,
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  client: QueryClient,
  options: UseBaseQueryOptions<TData, TQueryKey>,
): UseBaseQueryResult<TData, TError> {
  console.log('🔵 [useBaseQuery] 函数被调用，queryKey:', options.queryKey)
  
  // 稳定化 options，避免无限循环
  const stableOptions = useMemo(() => {
    console.log('🔵 [useBaseQuery] useMemo 重新计算 stableOptions，queryKey:', options.queryKey)
    return options
  }, [JSON.stringify(options)])

  // 在整个组件生命周期中保持 `QueryObserver` 唯一
  const [observer] = useState(() => {
    console.log('🔵 [useBaseQuery] useState 创建新的 QueryObserver，queryKey:', stableOptions.queryKey)
    return new QueryObserver<TData, TError, TQueryKey>(client, stableOptions)
  })

  // 缓存 getSnapshot 的结果，避免无限循环
  const lastSnapshotRef = useRef<UseBaseQueryResult<TData, TError>>()
  
  const getSnapshot = useCallback(() => {
    console.log('🔵 [useBaseQuery] getSnapshot 被调用')
    const currentResult = observer.getCurrentResult()
    console.log('🔵 [useBaseQuery] 当前查询结果:', {
      data: currentResult.data ? '有数据' : '无数据',
      isLoading: currentResult.isLoading,
      isError: currentResult.isError,
      error: currentResult.error
    })
    
    // 如果结果没有实际变化，返回缓存的结果以保持引用稳定性
    if (lastSnapshotRef.current) {
      const prev = lastSnapshotRef.current
      if (
        prev.data === currentResult.data &&
        prev.isLoading === currentResult.isLoading &&
        prev.isError === currentResult.isError &&
        prev.error === currentResult.error
      ) {
        console.log('🔵 [useBaseQuery] 状态未变化，返回缓存结果')
        return lastSnapshotRef.current
      }
    }
    
    console.log('🔵 [useBaseQuery] 状态有变化，返回新结果')
    lastSnapshotRef.current = currentResult
    return currentResult
  }, [observer])

  // 使用 useSyncExternalStore 来订阅状态变化
  const result = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        console.log('🔵 [useBaseQuery] useSyncExternalStore 订阅函数被调用')
        // 订阅，为了当状态更新时通知组件重新渲染
        const unsubscribe = observer.subscribe(() => {
          console.log('🟢 [useBaseQuery] 接收到 QueryObserver 状态变化通知，即将触发 React 重新渲染')
          onStoreChange()
        })
        console.log('🔵 [useBaseQuery] 已订阅 QueryObserver 状态变化')
        return unsubscribe
      },
      [observer],
    ),
    getSnapshot, // getSnapshot
    getSnapshot, // getServerSnapshot (SSR support)
  )

  useEffect(() => {
    console.log('🔵 [useBaseQuery] useEffect 被触发，stableOptions 或 observer 发生变化')
    // 更新选项并发起请求
    observer.setOptions(stableOptions)
    observer.fetchOptimistic()
  }, [stableOptions, observer])

  console.log('🔵 [useBaseQuery] 返回结果:', {
    data: result.data ? '有数据' : '无数据',
    isLoading: result.isLoading,
    isError: result.isError
  })
  
  return result
}
