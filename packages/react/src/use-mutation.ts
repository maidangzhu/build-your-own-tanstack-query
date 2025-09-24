import { useCallback, useState } from 'react'

// Mutation 状态类型
export type MutationStatus = 'idle' | 'pending' | 'success' | 'error'

// Mutation 结果类型
export interface UseMutationResult<TData = unknown, TError = Error, TVariables = unknown> {
  data: TData | undefined
  error: TError | null
  isIdle: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  reset: () => void
}

// Mutation 选项类型
export interface UseMutationOptions<TData = unknown, TError = Error, TVariables = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void
}

// useMutation hook 实现
export function useMutation<
  TData = unknown,
  TError = Error,
  TVariables = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [data, setData] = useState<TData | undefined>(undefined)
  const [error, setError] = useState<TError | null>(null)

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    try {
      setStatus('pending')
      setError(null)
      
      const result = await options.mutationFn(variables)
      
      setData(result)
      setStatus('success')
      
      options.onSuccess?.(result, variables)
      options.onSettled?.(result, null, variables)
      
      return result
    } catch (err) {
      const error = err as TError
      setError(error)
      setStatus('error')
      
      options.onError?.(error, variables)
      options.onSettled?.(undefined, error, variables)
      
      throw error
    }
  }, [options])

  const mutate = useCallback((variables: TVariables) => {
    mutateAsync(variables).catch(() => {
      // 错误已经在 mutateAsync 中处理了
    })
  }, [mutateAsync])

  const reset = useCallback(() => {
    setStatus('idle')
    setData(undefined)
    setError(null)
  }, [])

  return {
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    mutate,
    mutateAsync,
    reset
  }
}

