// React 特定的类型定义
export * from '@the-tanstack-query/core'

// React 相关的额外类型
export interface ReactQueryDevtoolsProps {
  initialIsOpen?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

// 组件类型重导出，方便使用
export type { QueryClientProviderProps } from './query-client-provider'
export type { UseMutationOptions, UseMutationResult, MutationStatus } from './use-mutation'

