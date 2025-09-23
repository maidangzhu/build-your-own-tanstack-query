import type { QueryOptions } from "./types"
import { hashKey } from "./utils"
import { Query } from "./query"

// queryCache.ts
export class QueryCache {
  #queries: Map<string, Query>

  constructor() {
    // 缓存，`queryKey` -> `query` 的映射
    this.#queries = new Map<string, Query>()
  }

  // `queryHash` —> `query`
  get(queryHash: string) {
    return this.#queries.get(queryHash)
  }

  // 如果当前没有缓存就将该 `query` 加入到缓存中
  add(query: Query): void {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query)
    }
  }

  // 构建 `Query` 实例
  build(options: QueryOptions) {
    const queryKey = options.queryKey
    const queryHash = hashKey(queryKey)
    let query = this.get(queryHash)
    // 保障了在相同 `queryKey` 下对应同一个 `query`
    if (!query) {
      query = new Query({
        queryKey,
        queryHash,
        options,
        cache: this,
      })
      this.add(query)
    }
    return query
  }
}
