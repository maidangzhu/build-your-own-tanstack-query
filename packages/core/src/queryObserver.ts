import type { UseBaseQueryOptions, UseBaseQueryResult, QueryKey } from './types'
import type { QueryClient } from './query-client'
import type { Query } from './query'

/**
 * QueryObserver 类 - 连接 Query 和 React 组件的观察者
 */
export class QueryObserver<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey> {
  private query: Query<TData, TError>
  private listeners: Set<() => void> = new Set()
  private unsubscribe?: () => void

  constructor(
    private client: QueryClient,
    private options: UseBaseQueryOptions<TData, TQueryKey>
  ) {
    console.log('🟡 [QueryObserver] 构造函数被调用，queryKey:', options.queryKey)
    // 通过 QueryCache 构建或获取 Query 实例
    this.query = client.getQueryCache().build(options) as Query<TData, TError>
    console.log('🟡 [QueryObserver] 已通过 QueryCache 获取 Query 实例')
    this.subscribe()
    console.log('🟡 [QueryObserver] 构造完成，已订阅 Query 状态变化')
  }

  /**
   * 获取乐观结果（在数据加载前返回预期的状态）
   */
  getOptimisticResult(options: UseBaseQueryOptions<TData, TQueryKey>): UseBaseQueryResult<TData, TError> {
    const query = this.client.getQueryCache().build(options) as Query<TData, TError>
    return query.getResult()
  }

  /**
   * 订阅状态变化
   */
  subscribe(onStoreChange?: () => void): () => void {
    if (onStoreChange) {
      console.log('🟡 [QueryObserver] 添加外部监听器（来自 useSyncExternalStore）')
      this.listeners.add(onStoreChange)
      return () => {
        console.log('🟡 [QueryObserver] 移除外部监听器')
        this.listeners.delete(onStoreChange)
      }
    }

    console.log('🟡 [QueryObserver] 订阅 Query 状态变化')
    // 订阅 Query 的状态变化
    this.unsubscribe = this.query.addObserver(() => {
      console.log('🟢 [QueryObserver] 接收到 Query 状态变化通知，开始 notify')
      this.notify()
    })

    return () => {
      console.log('🟡 [QueryObserver] 取消订阅 Query 状态变化')
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }
  }

  /**
   * 获取当前结果
   */
  getCurrentResult(): UseBaseQueryResult<TData, TError> {
    console.log('🟡 [QueryObserver] getCurrentResult 被调用')
    const result = this.query.getResult()
    console.log('🟡 [QueryObserver] 返回查询结果:', {
      data: result.data ? '有数据' : '无数据',
      isLoading: result.isLoading,
      isError: result.isError
    })
    return result
  }

  /**
   * 设置新的选项
   */
  setOptions(options: UseBaseQueryOptions<TData, TQueryKey>): void {
    console.log('🟡 [QueryObserver] setOptions 被调用，新 queryKey:', options.queryKey)
    const prevOptions = this.options
    this.options = options

    // 如果 queryKey 发生变化，需要重新构建 Query
    if (JSON.stringify(prevOptions.queryKey) !== JSON.stringify(options.queryKey)) {
      console.log('🟡 [QueryObserver] queryKey 发生变化，重新构建 Query')
      // 取消订阅旧的 Query
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      
      // 构建新的 Query 并订阅
      this.query = this.client.getQueryCache().build(options) as Query<TData, TError>
      this.subscribe()
    }

    this.notify()
  }

  /**
   * 执行查询
   */
  fetchOptimistic(): void {
    console.log('🟡 [QueryObserver] fetchOptimistic 被调用，enabled:', this.options.enabled !== false)
    // 如果启用了查询，则执行
    if (this.options.enabled !== false) {
      console.log('🟡 [QueryObserver] 调用 Query.fetch() 执行查询')
      this.query.fetch()
    }
  }

  /**
   * 通知所有监听者
   */
  private notify(): void {
    console.log('🟡 [QueryObserver] notify 被调用，监听者数量:', this.listeners.size)
    let index = 0
    this.listeners.forEach((listener) => {
      index++
      console.log(`🟢 [QueryObserver] 调用监听器 ${index}`)
      listener()
    })
  }

  /**
   * 销毁观察者
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.listeners.clear()
  }
}
