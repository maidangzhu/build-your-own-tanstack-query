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
    this.observers.forEach(observer => observer())
  }

  /**
   * 获取当前查询结果
   */
  getResult() {
    return {
      data: this.state.data,
      error: this.state.error,
      isLoading: this.state.status === 'pending',
      isError: this.state.status === 'error',
      isSuccess: this.state.status === 'success',
      isFetching: this.state.isFetching,
      refetch: () => this.fetch()
    }
  }
} 