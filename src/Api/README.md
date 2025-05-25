# 🌐 API Services - External Data Integration

This directory contains API service classes for fetching data from external APIs using a centralized dependency injection pattern. Each service extends the base `ApiClient` and is managed through the `ApiClients` system.

## 📁 Structure

```
services/
├── ApiClient.ts                # Base API client class
├── ApiClients.ts              # Centralized client management & DI
├── clients/
│   ├── service-elixirs.ts     # Elixir API service
│   ├── service-houses.ts      # Houses API service  
│   └── service-spells.ts      # Spells API service
└── README.md
```

## 🏗️ Architecture Overview

### Dependency Injection Pattern
The application uses Vue's provide/inject system for centralized API client management:

1. **ApiClients.ts** - Manages all service instances
2. **App.vue** - Provides ApiClients to the entire app
3. **Components** - Inject and use the API clients

### ApiClients Central Management
```typescript
// ApiClients.ts
export interface ApiClients {
  generic: IApiClient
  serviceHousesClient: ServiceHousesClient
  serviceSpellsClient: ServiceSpellsClient
  serviceElixirsClient: ServiceElixirsClient
}

export class ApiClientsImpl implements ApiClients {
  generic: IApiClient
  serviceHousesClient: ServiceHousesClient
  serviceSpellsClient: ServiceSpellsClient
  serviceElixirsClient: ServiceElixirsClient

  constructor() {
    this.generic = new ApiClient()
    this.serviceHousesClient = new ServiceHousesClient()
    this.serviceSpellsClient = new ServiceSpellsClient()
    this.serviceElixirsClient = new ServiceElixirsClient()
  }
}
```

### Application Setup
```typescript
// App.vue
import { ApiClientsImpl } from '@/Api/ApiClients'

const apiClients = new ApiClientsImpl()
provide('apiClients', apiClients)
```

## 📚 Available Services

### 🧪 ServiceElixirsClient
Handles elixir and potion data from the API.

```typescript
class ServiceElixirsClient extends ApiClient {
  serviceName = "Elixirs/"
  
  getElixirs(): Promise<ApiResponse<ElixirInterface[]>>
  getElixirById(id: string): Promise<ApiResponse<ElixirInterface>>
}
```

**Usage:**
```typescript
import type { ApiClientsImpl } from '@/Api/ApiClients'

const apiClients = inject<ApiClientsImpl>('apiClients')

// Fetch all elixirs
const response = await apiClients?.serviceElixirsClient.getElixirs()

// Fetch specific elixir
const elixir = await apiClients?.serviceElixirsClient.getElixirById('felix-felicis')
```

### 🏠 ServiceHousesClient
Manages Hogwarts house data from the API.

```typescript
class ServiceHousesClient extends ApiClient {
  serviceName = "Houses/"
  
  getHouses(): Promise<ApiResponse<HouseInterface[]>>
  getHouseById(id: string): Promise<ApiResponse<HouseInterface>>
}
```

**Usage:**
```typescript
import type { ApiClientsImpl } from '@/Api/ApiClients'

const apiClients = inject<ApiClientsImpl>('apiClients')

// Fetch all houses
const response = await apiClients?.serviceHousesClient.getHouses()

// Fetch specific house
const house = await apiClients?.serviceHousesClient.getHouseById('gryffindor')
```

### ⚡ ServiceSpellsClient
Handles spell repository data from the API.

```typescript
class ServiceSpellsClient extends ApiClient {
  serviceName = "Spells/"
  
  getSpells(): Promise<ApiResponse<SpellInterface[]>>
  getSpellById(id: string): Promise<ApiResponse<SpellInterface>>
}
```

**Usage:**
```typescript
import type { ApiClientsImpl } from '@/Api/ApiClients'

const apiClients = inject<ApiClientsImpl>('apiClients')

// Fetch all spells
const response = await apiClients?.serviceSpellsClient.getSpells()

// Fetch specific spell
const spell = await apiClients?.serviceSpellsClient.getSpellById('expelliarmus')
```

## 🔧 Component Usage Patterns

### Basic Component Setup
```typescript
<script setup lang="ts">
import type { ApiClientsImpl } from '@/Api/ApiClients'

// Inject API clients
const apiClients = inject<ApiClientsImpl>('apiClients')

// Reactive state
const elixirs = ref<ElixirInterface[]>([])
const isLoading = ref(false)

// Load elixirs
const loadElixirs = async () => {
  if (!apiClients) return
  
  isLoading.value = true
  try {
    const response = await apiClients.serviceElixirsClient.getElixirs()
    if (response.success) {
      elixirs.value = response.data
    }
  } catch (error) {
    console.error('Failed to load elixirs:', error)
  } finally {
    isLoading.value = false
  }
}

// Load on mount
onMounted(() => {
  loadElixirs()
})
</script>
```

## 🏪 Store Integration

### Pinia Store Pattern
```typescript
import type { ApiClientsImpl } from '@/Api/ApiClients'

export const useSpellStore = defineStore('spellStore', () => {
  const spells = ref<SpellInterface[]>([])
  const isLoading = ref(false)
  
  // Actions receive apiClients as parameter
  const loadSpells = async (apiClients: ApiClientsImpl) => {
    isLoading.value = true
    try {
      const response = await apiClients.serviceSpellsClient.getSpells()
      if (response.success) {
        spells.value = response.data
      }
    } catch (error) {
      console.error('Failed to load spells:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  const loadSpellById = async (apiClients: ApiClientsImpl, id: string) => {
    try {
      const response = await apiClients.serviceSpellsClient.getSpellById(id)
      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error('Failed to load spell:', error)
    }
  }

  return {
    spells,
    isLoading,
    loadSpells,
    loadSpellById
  }
})
```

### Using Store with API Clients
```typescript
// Component using store
const apiClients = inject<ApiClientsImpl>('apiClients')
const spellStore = useSpellStore()

// Call store action with apiClients
const loadData = async () => {
  if (apiClients) {
    await spellStore.loadSpells(apiClients)
  }
}
```

## 🚀 Creating a New Service

### Step 1: Define Interface
Create the TypeScript interface in `/interfaces/`:

```typescript
// interfaces/wizards.ts
export interface WizardInterface {
  id: string
  name: string
  house: string
  bloodStatus: string
  patronus?: string
  wand?: {
    wood: string
    core: string
    length: number
  }
}
```

### Step 2: Create Service Class
Create the service in `/services/clients/`:

```typescript
// services/clients/service-wizards.ts
import type { WizardInterface } from "@/interfaces/wizards"
import type { ApiResponse } from "../ApiClient"
import ApiClient from "../ApiClient"

export default class ServiceWizardsClient extends ApiClient {
  serviceName = "Wizards/"

  /**
   * Get all wizards
   */
  getWizards(): Promise<ApiResponse<WizardInterface[]>> {
    return this.get<WizardInterface[]>("")
  }

  /**
   * Get wizard by ID
   */
  getWizardById(id: string): Promise<ApiResponse<WizardInterface>> {
    return this.get<WizardInterface>(`${id}`)
  }

  /**
   * Get wizards by house
   */
  getWizardsByHouse(house: string): Promise<ApiResponse<WizardInterface[]>> {
    return this.get<WizardInterface[]>(`?house=${encodeURIComponent(house)}`)
  }
}
```

### Step 3: Add to ApiClients
Update `ApiClients.ts` to include the new service:

```typescript
// ApiClients.ts
import ServiceWizardsClient from "./clients/service-wizards"

export interface ApiClients {
  generic: IApiClient
  serviceHousesClient: ServiceHousesClient
  serviceSpellsClient: ServiceSpellsClient
  serviceElixirsClient: ServiceElixirsClient
  serviceWizardsClient: ServiceWizardsClient // Add new service
}

export class ApiClientsImpl implements ApiClients {
  generic: IApiClient
  serviceHousesClient: ServiceHousesClient
  serviceSpellsClient: ServiceSpellsClient
  serviceElixirsClient: ServiceElixirsClient
  serviceWizardsClient: ServiceWizardsClient // Add new service

  constructor() {
    this.generic = new ApiClient()
    this.serviceHousesClient = new ServiceHousesClient()
    this.serviceSpellsClient = new ServiceSpellsClient()
    this.serviceElixirsClient = new ServiceElixirsClient()
    this.serviceWizardsClient = new ServiceWizardsClient() // Initialize
  }
}
```

### Step 4: Use in Application
```typescript
import type { ApiClientsImpl } from '@/Api/ApiClients'

const apiClients = inject<ApiClientsImpl>('apiClients')

// Use the new service
const loadWizards = async () => {
  if (!apiClients) return
  
  try {
    const response = await apiClients.serviceWizardsClient.getWizards()
    if (response.success) {
      wizards.value = response.data
    }
  } catch (error) {
    console.error('Failed to load wizards:', error)
  }
}
```

## 🎯 Common Service Patterns

### CRUD Operations
```typescript
export default class ServiceExampleClient extends ApiClient {
  serviceName = "Examples/"

  // READ operations
  getAll(): Promise<ApiResponse<ItemInterface[]>> {
    return this.get<ItemInterface[]>("")
  }

  getById(id: string): Promise<ApiResponse<ItemInterface>> {
    return this.get<ItemInterface>(`${id}`)
  }

  // CREATE operation
  create(item: Omit<ItemInterface, 'id'>): Promise<ApiResponse<ItemInterface>> {
    return this.post<ItemInterface>("", item)
  }

  // UPDATE operation
  update(id: string, item: Partial<ItemInterface>): Promise<ApiResponse<ItemInterface>> {
    return this.put<ItemInterface>(`${id}`, item)
  }

  // DELETE operation
  delete(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${id}`)
  }
}
```
## 🛡️ Error Handling

### Safe API Client Usage
```typescript
const loadData = async () => {
  // Always check if apiClients exists
  if (!apiClients) {
    console.error('API clients not available')
    return
  }
  
  try {
    const response = await apiClients.serviceSpellsClient.getSpells()
    
    if (response.success) {
      data.value = response.data
    } else {
      // Handle API error response
      error.value = response.message || 'API request failed'
    }
  } catch (err) {
    // Handle network/unexpected errors
    error.value = 'Network error occurred'
    console.error('API Error:', err)
  }
}
```

### Response Type Structure
```typescript
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  status?: number
}
```

## 📈 Best Practices

### Service Design
- ✅ **One service per resource** (Spells, Houses, Elixirs)
- ✅ **Consistent naming** (`ServiceResourceClient`)
- ✅ **Clear method names** (`getById`, `search`, etc.)
- ✅ **Proper TypeScript typing** throughout

### Dependency Injection
- ✅ **Always check injection** (`if (!apiClients) return`)
- ✅ **Use optional chaining** (`apiClients?.service`)
- ✅ **Handle injection failures** gracefully
- ✅ **Pass to stores** as parameters

### Error Management
- ✅ **Check response.success** before using data
- ✅ **Handle network errors** with try/catch
- ✅ **Provide user feedback** for errors
- ✅ **Log errors** for debugging

### Performance
- ✅ **Use query parameters** for filtering
- ✅ **Implement pagination** for large datasets
- ✅ **Debounce search** requests
- ✅ **Cache responses** when appropriate

## 🔍 Debugging Tips

### Check Injection
```typescript
const apiClients = inject<ApiClientsImpl>('apiClients')
console.log('API Clients available:', !!apiClients)
```

### Log API Responses
```typescript
const response = await apiClients.serviceSpellsClient.getSpells()
console.log('API Response:', response)
```

### Verify Service Registration
```typescript
// In ApiClients constructor
constructor() {
  console.log('Initializing API clients...')
  this.serviceSpellsClient = new ServiceSpellsClient()
  console.log('Spells client initialized:', !!this.serviceSpellsClient)
}
```

## 📚 Resources

- **[Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)** - Dependency injection
- **[TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)** - Generic types
- **[REST API Design](https://restfulapi.net/)** - API design principles
- **[Axios Documentation](https://axios-http.com/)** - HTTP client library

---

**Centralized, type-safe API integration with dependency injection** 🌐