import { useQuery } from '@tanstack/vue-query'
import { useApi } from './useApi'

export const spellKeys = {
  all: ['spells'] as const,
  lists: () => [...spellKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...spellKeys.lists(), filters] as const,
  details: () => [...spellKeys.all, 'detail'] as const,
  detail: (id: string) => [...spellKeys.details(), id] as const,
}

export function useSpells() {
  const api = useApi()
  const spellsQuery = useQuery({
    queryKey: spellKeys.list(),
    queryFn: async () => {
      const response = await api.serviceSpellsClient.getSpells()
      return response.data
    },
  })
  return {
    spells: spellsQuery.data,
    isLoading: spellsQuery.isLoading,
    isError: spellsQuery.isError,
    error: spellsQuery.error,
    refetch: spellsQuery.refetch,
  }
}

export function useSpell(id: string) {
  const api = useApi()
  const spellQuery = useQuery({
    queryKey: spellKeys.detail(id),
    queryFn: async () => {
      const response = await api.serviceSpellsClient.getSpellById(id)
      return response.data
    },
    enabled: !!id,
  })
  return {
    spell: spellQuery.data,
    isLoading: spellQuery.isLoading,
    isError: spellQuery.isError,
    error: spellQuery.error,
    refetch: spellQuery.refetch,
  }
}