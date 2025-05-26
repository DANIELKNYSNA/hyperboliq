import { useQuery } from '@tanstack/vue-query'
import { useApi } from './useApi'

export const elixirKeys = {
  all: ['elixirs'] as const,
  lists: () => [...elixirKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...elixirKeys.lists(), filters] as const,
  details: () => [...elixirKeys.all, 'detail'] as const,
  detail: (id: string) => [...elixirKeys.details(), id] as const,
}

export function useElixirs() {
  const api = useApi()
  const elixirsQuery = useQuery({
    queryKey: elixirKeys.list(),
    queryFn: async () => {
      const response = await api.serviceElixirsClient.getElixirs()
      return response.data
    },
  })
  return {
    elixirs: elixirsQuery.data,
    isLoading: elixirsQuery.isLoading,
    isError: elixirsQuery.isError,
    error: elixirsQuery.error,
    refetch: elixirsQuery.refetch,
  }
}

export function useElixir(id: string) {
  const api = useApi()
  const elixirQuery = useQuery({
    queryKey: elixirKeys.detail(id),
    queryFn: async () => {
      const response = await api.serviceElixirsClient.getElixirById(id)
      return response.data
    },
    enabled: !!id,
  })
  return {
    elixir: elixirQuery.data,
    isLoading: elixirQuery.isLoading,
    isError: elixirQuery.isError,
    error: elixirQuery.error,
    refetch: elixirQuery.refetch,
  }
}