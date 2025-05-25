# 🏪 Stores - State Management

This directory contains all Pinia stores for centralized state management in the Wizard World application. Each store handles a specific domain of the application state.

## 📁 Store Structure

```
stores/
├── elixirStore.ts      # Elixir/potion management
├── houseStore.ts       # Hogwarts house data
├── spellStore.ts       # Spell collection & management
├── uiStore.ts          # UI preferences & tracking
├── userStore.ts        # Authentication & user profile
└── README.md
```

## 🎯 Store Overview

| Store | Purpose | Key Features | Persistence |
|-------|---------|--------------|-------------|
| **`useElixirStore`** | Elixir management | CRUD operations, favorites | ✅ |
| **`useHouseStore`** | House information | House selection, user house | ✅ |
| **`useSpellStore`** | Spell repository | CRUD operations, favorites | ✅ |
| **`useUiStore`** | UI state | Dark mode, visit tracking | ✅ |
| **`useUserStore`** | Authentication | Login, profile, quiz scores | ✅ |

## 🛠️ Technology Stack

- **[Pinia](https://pinia.vuejs.org/)** - Modern state management
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** - Reactive stores
- **[Pinia Plugin Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)** - Auto persistence

## 📚 Store Details

### 🧪 ElixirStore (`useElixirStore`)
```typescript
interface ElixirStore {
  elixirs: ElixirInterface[] | null
  selectedElixir: ElixirInterface | null
  likedElixirs: ElixirInterface[]
  deleteElixir: (id: string) => void
}
```
**Features:**
- Elixir collection management
- Favorite elixirs tracking
- Delete operations with cleanup

### 🏠 HouseStore (`useHouseStore`)
```typescript
interface HouseStore {
  houses: HouseInterface[] | null
  userSelectedHouse: HouseInterface | null
  myHouse: HouseInterface | null
}
```
**Features:**
- Hogwarts house data storage
- User house selection
- Personal house assignment

### ⚡ SpellStore (`useSpellStore`)
```typescript
interface SpellStore {
  spells: SpellInterface[] | null
  selectedSpell: SpellInterface | null
  likedSpells: SpellInterface[]
  deleteSpell: (id: string) => void
}
```
**Features:**
- Spell repository management
- Favorite spells collection
- CRUD operations with state cleanup

### 🎨 UiStore (`useUiStore`)
```typescript
interface UiStore {
  isDarkMode: boolean
  tracker: { visitCount: number; lastViewedSpell: string }
  themeClass: ComputedRef<string>
  toggleDarkMode: () => void
}
```
**Features:**
- Dark/light theme management
- User activity tracking
- DOM manipulation for theme switching

### 👤 UserStore (`useUserStore`)
```typescript
interface UserStore {
  user: User | null
  isLoading: boolean
  quizzScores: Record<string, number>
  // Computed properties
  isAuthenticated: ComputedRef<boolean>
  userFullName: ComputedRef<string>
  userInitials: ComputedRef<string>
  isAdmin: ComputedRef<boolean>
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}
```
**Features:**
- User authentication & authorization
- Profile management
- Quiz score tracking
- Role-based access control

## 🔄 Common Patterns

### Store Definition
```typescript
export const useExampleStore = defineStore('exampleStore', () => {
  // State
  const data = ref<DataType[]>([])
  const selected = ref<DataType | null>(null)

  // Computed
  const isLoaded = computed(() => !!data.value?.length)

  // Actions
  const loadData = async () => {
    // Implementation
  }

  return {
    data,
    selected,
    isLoaded,
    loadData
  }
}, {
  persist: true // Enable persistence
})
```

### Store Usage in Components
```typescript
<script setup lang="ts">
import { useExampleStore } from '@/stores/exampleStore'

const store = useExampleStore()

// Access state
const { data, selected } = storeToRefs(store)

// Call actions
store.loadData()
</script>
```

## 💾 State Persistence

All stores use **automatic persistence** via `pinia-plugin-persistedstate`:

```typescript
{
  persist: true // Saves to localStorage automatically
}
```

**Benefits:**
- ✅ State survives page refreshes
- ✅ Seamless user experience
- ✅ No manual storage handling
- ✅ Configurable storage options

## 🎯 Type Safety

### Interface Definitions
```typescript
// Located in /interfaces/
export interface SpellInterface {
  id?: string
  name: string
  incantation: string
  effect: string
  canBeVerbal: boolean
  type: string
  light: string
  creator: string
}
```

### Store Type Safety
- **Full TypeScript support** throughout
- **Interface-driven development**
- **Computed property typing**
- **Action parameter validation**

## 🚦 Usage Guidelines

### Accessing Stores
```typescript
// ✅ Correct - in setup() or <script setup>
const userStore = useUserStore()

// ❌ Avoid - outside component setup
const store = useUserStore() // May cause issues
```

### Reactive Access
```typescript
// ✅ Reactive access to state
const { user, isAuthenticated } = storeToRefs(userStore)

// ✅ Direct action calls
userStore.login(credentials)

// ❌ Destructuring state (loses reactivity)
const { user } = userStore // Not reactive
```

### Error Handling
```typescript
try {
  await userStore.login(credentials)
  // Handle success
} catch (error) {
  // Handle error
  console.error('Login failed:', error)
}
```

## 🔧 Development Tips

### Adding New Stores
1. Create store file in `/stores/`
2. Define TypeScript interfaces in `/interfaces/`
3. Follow existing naming conventions
4. Add persistence if needed
5. Write comprehensive tests

### State Structure
- **Keep state normalized** - avoid deep nesting
- **Use null for loading states** - indicates unloaded data
- **Separate concerns** - each store has single responsibility
- **Maintain consistency** - follow established patterns

### Testing Stores
- **Test initial state**
- **Test all actions and mutations**
- **Test computed properties**
- **Test error scenarios**
- **Verify persistence behavior**

## 📖 Resources

- **[Pinia Documentation](https://pinia.vuejs.org/)**
- **[Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)**
- **[TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)**
- **[State Management Patterns](https://pinia.vuejs.org/core-concepts/)**

---

**Built with Pinia + TypeScript for type-safe, reactive state management** 🚀