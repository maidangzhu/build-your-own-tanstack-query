import type { QueryKey, QueryState, QueryOptions, QueryCache } from './types'

/**
 * Query 类 - 管理单个查询的状态和生命周期
 */
export class Query<TData = unknown, TError = Error> {
  public queryKey: QueryKey
  public queryHash: string
  public state: QueryState<TData, TError>
  private options: QueryOptions<TData>
  private observers: Set<() => void> = new Set()
  private lastResult: any = null

  constructor({
    queryKey,
    queryHash,
    options
  }: {
    queryKey: QueryKey
    queryHash: string
    options: QueryOptions<TData>
    cache: QueryCache
  }) {
    this.queryKey = queryKey
    this.queryHash = queryHash
    this.options = options
    this.state = {
      status: 'pending',
      data: undefined,
      error: null,
      isFetching: false
    }
  }

  /**
   * 执行查询
   */
  async fetch(): Promise<void> {
    // 防止重复请求
    if (this.state.isFetching) return
    
    this.state.isFetching = true
    this.state.status = 'pending'
    this.state.error = null
    this.notify()
    
    try {
      const data = await this.options.queryFn()
      this.state.data = data
      this.state.status = 'success'
      this.state.error = null
    } catch (error) {
      this.state.error = error as TError
      this.state.status = 'error'
    } finally {
      this.state.isFetching = false
      this.notify()
    }
  }

  /**
   * 添加观察者
   */
  addObserver(observer: () => void): () => void {
    this.observers.add(observer)
    return () => this.observers.delete(observer)
  }

  /**
   * 通知所有观察者状态变化
   */
  private notify(): void {
    // 清除缓存的结果，因为状态已经改变
    this.lastResult = null
    this.observers.forEach(observer => observer())
  }

  /**
   * 获取当前查询结果
   */
  getResult() {
    const currentResult = {
      data: this.state.data,
      error: this.state.error,
      isLoading: this.state.status === 'pending',
      isError: this.state.status === 'error',
      isSuccess: this.state.status === 'success',
      isFetching: this.state.isFetching,
      status: this.state.status,
      refetch: () => this.fetch()
    }

    // 如果结果没有实际变化，返回缓存的结果以保持引用稳定性
    if (this.lastResult) {
      if (
        this.lastResult.data === currentResult.data &&
        this.lastResult.error === currentResult.error &&
        this.lastResult.isLoading === currentResult.isLoading &&
        this.lastResult.isError === currentResult.isError &&
        this.lastResult.isSuccess === currentResult.isSuccess &&
        this.lastResult.isFetching === currentResult.isFetching &&
        this.lastResult.status === currentResult.status
      ) {
        return this.lastResult
      }
    }

    this.lastResult = currentResult
    return currentResult
  }
} 