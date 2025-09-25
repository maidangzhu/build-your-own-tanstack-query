import type { QueryOptions } from "./types"
import { hashKey } from "./utils"
import { Query } from "./query"

// queryCache.ts
export class QueryCache {
  #queries: Map<string, Query>

  constructor() {
    console.log('🟣 [QueryCache] 构造函数被调用，创建新的 QueryCache 实例')
    // 缓存，`queryKey` -> `query` 的映射
    this.#queries = new Map<string, Query>()
    console.log('🟣 [QueryCache] 查询缓存 Map 已初始化')
  }

  // `queryHash` —> `query`
  get(queryHash: string) {
    console.log('🟣 [QueryCache] get 被调用，queryHash:', queryHash)
    const query = this.#queries.get(queryHash)
    console.log('🟣 [QueryCache] 查询缓存结果:', query ? '找到缓存' : '未找到缓存')
    return query
  }

  // 如果当前没有缓存就将该 `query` 加入到缓存中
  add(query: Query): void {
    console.log('🟣 [QueryCache] add 被调用，queryHash:', query.queryHash)
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query)
      console.log('🟣 [QueryCache] Query 已添加到缓存，当前缓存数量:', this.#queries.size)
    } else {
      console.log('🟣 [QueryCache] Query 已存在于缓存中，跳过添加')
    }
  }

  // 构建 `Query` 实例
  build(options: QueryOptions) {
    console.log('🟣 [QueryCache] build 被调用，queryKey:', options.queryKey)
    const queryKey = options.queryKey
    const queryHash = hashKey(queryKey)
    console.log('🟣 [QueryCache] 计算得到 queryHash:', queryHash)
    
    let query = this.get(queryHash)
    // 保障了在相同 `queryKey` 下对应同一个 `query`
    if (!query) {
      console.log('🟣 [QueryCache] 缓存中没有找到 Query，创建新的 Query 实例')
      query = new Query({
        queryKey,
        queryHash,
        options,
        cache: this,
      })
      this.add(query)
      console.log('🟣 [QueryCache] 新 Query 实例已创建并添加到缓存')
    } else {
      console.log('🟣 [QueryCache] 从缓存中返回已有的 Query 实例')
    }
    return query
  }
}
