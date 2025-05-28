import { useQuery} from '@tanstack/vue-query'
import { useApi } from './useApi'

export const ingredientKeys = {
  all: ['ingredients'] as const,
  lists: () => [...ingredientKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...ingredientKeys.lists(), filters] as const,
  details: () => [...ingredientKeys.all, 'detail'] as const,
  detail: (id: string) => [...ingredientKeys.details(), id] as const,
}

export function useIngredients() {
  const api = useApi()
  const ingredientsQuery = useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: async () => {
      const response = await api.serviceIngredientsClient.getIngredients()
      return response.data
    },
  })
  return {
    ingredients: ingredientsQuery.data,
    isLoadingIngredients: ingredientsQuery.isLoading,
    isErrorIngredients: ingredientsQuery.isError,
    errorIngredients: ingredientsQuery.error,
    refetchIngredients: ingredientsQuery.refetch,
  }
}