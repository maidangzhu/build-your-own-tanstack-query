import React, { createContext, useContext, ReactNode } from 'react'
import { QueryClient } from '@the-tanstack-query/core'

// 创建 QueryClient Context
const QueryClientContext = createContext<QueryClient | undefined>(undefined)

// QueryClientProvider 组件的 props 类型
export interface QueryClientProviderProps {
  client: QueryClient
  children: ReactNode
}

// QueryClientProvider 组件
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  client,
  children
}) => {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  )
}

// useQueryClient hook - 用于获取 QueryClient 实例
export const useQueryClient = (): QueryClient => {
  const client = useContext(QueryClientContext)
  
  if (!client) {
    throw new Error(
      'useQueryClient must be used within a QueryClientProvider'
    )
  }
  
  return client
}

