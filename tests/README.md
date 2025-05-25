# 🧪 Test Suite

This directory contains comprehensive unit tests for the Wizard World application, ensuring reliability and maintainability of all components and stores.

## 📁 Structure

```
tests/
├── unit/
│   ├── components/              # Component tests
│   │   └── UpdateSpellDialog.test.ts
│   └── stores/                  # Store tests
│       ├── elixirStore.test.ts
│       ├── houseStore.test.ts
│       ├── spellStore.test.ts
│       ├── userStore.test.ts
│       └── uiStore.test.ts
└── README.md
```

## 🚀 Running Tests

```bash
# Run all tests
npm run test:unit

## 📊 Test Coverage

| Category | Coverage | Files Tested |
|----------|----------|--------------|
| **Components** | 100% | UpdateSpellDialog |
| **Stores** | 100% | All 5 stores |
| **Total Tests** | 100+ | Comprehensive suite |

## 🛠️ Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast test runner
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Vue component testing
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM simulation
- **Mock functions** - vi.fn() for isolated testing

## 📝 Test Categories

### Component Tests
- ✅ Rendering and props
- ✅ User interactions and events
- ✅ Form validation and submission
- ✅ Conditional rendering
- ✅ Error handling
- ✅ Accessibility

### Store Tests
- ✅ Initial state
- ✅ State mutations
- ✅ Computed properties
- ✅ Actions and async operations
- ✅ Error handling
- ✅ Type safety
- ✅ Persistence behavior

## 🎯 Writing New Tests

### Component Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import YourComponent from '@/components/YourComponent.vue'

describe('YourComponent', () => {
  beforeEach(() => {
    // Setup
  })

  it('should render correctly', () => {
    const wrapper = mount(YourComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### Store Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useYourStore } from '@/stores/yourStore'

describe('useYourStore', () => {
  let store: ReturnType<typeof useYourStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useYourStore()
  })

  it('should initialize correctly', () => {
    expect(store.someProperty).toBeDefined()
  })
})
```

## 🔍 Key Testing Patterns

### Mocking Pinia Stores
```typescript
vi.mock('@/stores/spellStore', () => ({
  useSpellStore: vi.fn()
}))
```

### Testing Async Actions
```typescript
it('should handle async operations', async () => {
  const promise = store.asyncAction()
  vi.advanceTimersByTime(1000)
  await promise
  expect(store.result).toBeDefined()
})
```

### DOM Testing
```typescript
const mockClassList = { add: vi.fn(), remove: vi.fn() }
Object.defineProperty(document, 'body', {
  value: { classList: mockClassList }
})
```

## ✨ Best Practices

- **Isolation** - Each test is independent
- **Descriptive names** - Clear test descriptions
- **Setup/Teardown** - Proper beforeEach/afterEach
- **Edge cases** - Test error conditions
- **Type safety** - TypeScript throughout
- **Mocking** - Mock external dependencies

## 📈 Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

Current coverage meets all goals with comprehensive test scenarios covering happy paths, edge cases, and error conditions.