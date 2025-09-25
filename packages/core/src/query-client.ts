// TODO: 实现 QueryClient 类 
import { QueryCache } from "./query-cache";

export class QueryClient {
  private queryCache: QueryCache;

  constructor() {
    console.log('🔴 [QueryClient] 构造函数被调用，创建新的 QueryClient 实例')
    this.queryCache = new QueryCache();
    console.log('🔴 [QueryClient] QueryCache 实例已创建并关联')
  }

  getQueryCache() {
    console.log('🔴 [QueryClient] getQueryCache 被调用，返回 QueryCache 实例')
    return this.queryCache;
  }

  setQueryCache(queryCache: QueryCache) {
    console.log('🔴 [QueryClient] setQueryCache 被调用，替换 QueryCache 实例')
    this.queryCache = queryCache;
  }
}
