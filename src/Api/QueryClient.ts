import { QueryClient } from '@tanstack/vue-query'
import { ApiError, type ErrorWithStatus } from './ApiClient'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError) {
          if (error.status >= 400 && error.status < 500) {
            return false
          }
        }
        if (error instanceof Error && 'status' in error) {
          const status = (error as ErrorWithStatus).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})