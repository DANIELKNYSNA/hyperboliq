import { useQuery} from '@tanstack/vue-query'
import { useApi } from './useApi'

export const houseKeys = {
  all: ['houses'] as const,
  lists: () => [...houseKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...houseKeys.lists(), filters] as const,
  details: () => [...houseKeys.all, 'detail'] as const,
  detail: (id: string) => [...houseKeys.details(), id] as const,
}

export function useHouses() {
  const api = useApi()
  const housesQuery = useQuery({
    queryKey: houseKeys.lists(),
    queryFn: async () => {
      const response = await api.serviceHousesClient.getHouses()
      return response.data
    },
  })
  return {
    houses: housesQuery.data,
    isLoading: housesQuery.isLoading,
    isError: housesQuery.isError,
    error: housesQuery.error,
    refetch: housesQuery.refetch,
  }
}

export function useHouse(id: string) {
  const api = useApi()
  const houseQuery = useQuery({
    queryKey: houseKeys.detail(id),
    queryFn: async () => {
      const response = await api.serviceHousesClient.getHouseById(id)
      return response.data
    },
    enabled: !!id,
  })
  return {
    house: houseQuery.data,
    isLoading: houseQuery.isLoading,
    isError: houseQuery.isError,
    error: houseQuery.error,
    refetch: houseQuery.refetch,
  }
}