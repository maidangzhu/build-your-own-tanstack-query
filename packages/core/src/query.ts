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
    console.log('🟠 [Query] 构造函数被调用，queryKey:', queryKey, 'queryHash:', queryHash)
    this.queryKey = queryKey
    this.queryHash = queryHash
    this.options = options
    this.state = {
      status: 'pending',
      data: undefined,
      error: null,
      isFetching: false
    }
    console.log('🟠 [Query] 初始状态:', this.state)
  }

  /**
   * 执行查询
   */
  async fetch(): Promise<void> {
    console.log('🟠 [Query] fetch 被调用，queryKey:', this.queryKey)
    
    // 防止重复请求
    if (this.state.isFetching) {
      console.log('🟠 [Query] 已在请求中，跳过重复请求')
      return
    }
    
    console.log('🟠 [Query] 开始执行查询，设置 isFetching=true, status=pending')
    this.state.isFetching = true
    this.state.status = 'pending'
    this.state.error = null
    console.log('🟠 [Query] 状态更新后:', this.state)
    console.log('🟠 [Query] 第一次 notify - 通知开始请求')
    this.notify()
    
    try {
      console.log('🟠 [Query] 开始执行 queryFn')
      const data = await this.options.queryFn()
      console.log('🟠 [Query] queryFn 执行成功，数据:', data ? '有数据' : '无数据')
      this.state.data = data
      this.state.status = 'success'
      this.state.error = null
      console.log('🟠 [Query] 成功状态更新后:', this.state)
    } catch (error) {
      console.log('🟠 [Query] queryFn 执行失败，错误:', error)
      this.state.error = error as TError
      this.state.status = 'error'
      console.log('🟠 [Query] 错误状态更新后:', this.state)
    } finally {
      console.log('🟠 [Query] 请求完成，设置 isFetching=false')
      this.state.isFetching = false
      console.log('🟠 [Query] 最终状态:', this.state)
      console.log('🟠 [Query] 第二次 notify - 通知请求完成')
      this.notify()
    }
  }

  /**
   * 添加观察者
   */
  addObserver(observer: () => void): () => void {
    console.log('🟠 [Query] 添加观察者，当前观察者数量:', this.observers.size)
    this.observers.add(observer)
    console.log('🟠 [Query] 观察者添加完成，新的观察者数量:', this.observers.size)
    return () => {
      console.log('🟠 [Query] 移除观察者')
      this.observers.delete(observer)
      console.log('🟠 [Query] 观察者移除完成，剩余观察者数量:', this.observers.size)
    }
  }

  /**
   * 通知所有观察者状态变化
   */
  private notify(): void {
    console.log('🟠 [Query] notify 被调用，观察者数量:', this.observers.size)
    // 清除缓存的结果，因为状态已经改变
    this.lastResult = null
    console.log('🟠 [Query] 已清除 lastResult 缓存')
    let index = 0
    this.observers.forEach((observer) => {
      index++
      console.log(`🟢 [Query] 通知观察者 ${index}`)
      observer()
    })
    console.log('🟠 [Query] 所有观察者通知完成')
  }

  /**
   * 获取当前查询结果
   */
  getResult() {
    console.log('🟠 [Query] getResult 被调用')
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

    console.log('🟠 [Query] 当前结果对象:', {
      data: currentResult.data ? '有数据' : '无数据',
      isLoading: currentResult.isLoading,
      isError: currentResult.isError,
      isSuccess: currentResult.isSuccess,
      isFetching: currentResult.isFetching,
      status: currentResult.status
    })

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
        console.log('🟠 [Query] 结果无变化，返回缓存结果')
        return this.lastResult
      }
    }

    console.log('🟠 [Query] 结果有变化，缓存新结果并返回')
    this.lastResult = currentResult
    return currentResult
  }
} 