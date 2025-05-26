import { inject, type InjectionKey } from 'vue'
import type { ApiClients } from '@/Api/ApiClients'

// Here I am using an injection key to provide a type-safe way to inject the API clients into components or composables
export const API_CLIENTS_KEY: InjectionKey<ApiClients> = Symbol('apiClients')

// Composable to access API clients
export function useApi(): ApiClients {
  const apiClients = inject(API_CLIENTS_KEY)
  if (!apiClients) {
    throw new Error('API clients not provided.')
  }
  return apiClients
}