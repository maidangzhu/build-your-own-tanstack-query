import type { QueryKey } from './types'

/**
 * 将 queryKey 数组转换为字符串 hash
 * 用于在 QueryCache 中唯一标识查询
 */
export const hashKey = (queryKey: QueryKey): string => {
  return JSON.stringify(queryKey)
}
