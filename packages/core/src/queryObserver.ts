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
    // 通过 QueryCache 构建或获取 Query 实例
    this.query = client.getQueryCache().build(options) as Query<TData, TError>
    this.subscribe()
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
      this.listeners.add(onStoreChange)
      return () => this.listeners.delete(onStoreChange)
    }

    // 订阅 Query 的状态变化
    this.unsubscribe = this.query.addObserver(() => {
      this.notify()
    })

    return () => {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }
  }

  /**
   * 获取当前结果
   */
  getCurrentResult(): UseBaseQueryResult<TData, TError> {
    return this.query.getResult()
  }

  /**
   * 设置新的选项
   */
  setOptions(options: UseBaseQueryOptions<TData, TQueryKey>): void {
    const prevOptions = this.options
    this.options = options

    // 如果 queryKey 发生变化，需要重新构建 Query
    if (JSON.stringify(prevOptions.queryKey) !== JSON.stringify(options.queryKey)) {
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
    // 如果启用了查询，则执行
    if (this.options.enabled !== false) {
      this.query.fetch()
    }
  }

  /**
   * 通知所有监听者
   */
  private notify(): void {
    this.listeners.forEach(listener => listener())
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
