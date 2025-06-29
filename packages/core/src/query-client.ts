// TODO: 实现 QueryClient 类 
import { QueryCache } from "./query-cache";

export class QueryClient {
  private queryCache: QueryCache;

  constructor() {
    this.queryCache = new QueryCache();
  }

  getQueryCache() {
    return this.queryCache;
  }

  setQueryCache(queryCache: QueryCache) {
    this.queryCache = queryCache;
  }
}