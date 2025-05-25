# 🧭 Router - Navigation & Route Management

This directory contains the Vue Router configuration for the Wizard World application, handling navigation, route protection, and authentication guards.

## 📁 Structure

```
router/
├── index.ts            # Main router configuration
└── README.md
```

## 🛣️ Route Overview

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomeView | Public | Landing page |
| `/houses` | HousesView | Protected | Hogwarts houses |
| `/spells` | SpellsView | Protected | Spell repository |
| `/spells/:id` | SpellDetailsView | Protected | Individual spell details |
| `/elixirs` | ElixirsView | Protected | Elixir collection |
| `/games` | GamesView | Protected | Quiz games |
| `/favourites` | MyFavourites | Protected | User favorites |
| `/login` | LoginView | Guest Only | Authentication |

## 🔐 Authentication System

### Route Protection Levels

**🟢 Public Routes**
- `/` (Home) - Accessible to everyone
- No authentication required

**🔒 Protected Routes**
- All routes with `meta: { requiresAuth: true }`
- Requires user authentication
- Redirects to home if not authenticated

**👤 Guest-Only Routes** 
- `/login` - Only accessible when not authenticated
- Redirects authenticated users to home

### Navigation Guards

#### Global Guard (`beforeEach`)
```typescript
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated) {
      next() // Allow access
    } else {
      next({ name: 'home' }) // Redirect to home
    }
  } else {
    next() // Public route, allow access
  }
})
```

#### Login Route Guard (`beforeEnter`)
```typescript
beforeEnter: (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    next({ name: 'home' }) // Already logged in
  } else {
    next() // Show login page
  }
}
```

## 🎯 Route Configuration

### Basic Route Structure
```typescript
{
  path: '/route-path',
  name: 'route-name',
  component: ComponentName,
  meta: { requiresAuth: boolean }
}
```

### Lazy Loading
Most routes use **dynamic imports** for code splitting:
```typescript
component: () => import('../views/ViewName.vue')
```

**Benefits:**
- ✅ Faster initial load time
- ✅ Better performance
- ✅ Automatic code splitting
- ✅ On-demand loading

### Route Parameters
```typescript
// Dynamic route with parameter
{
  path: '/spells/:id',
  name: 'spell-details',
  component: () => import('../views/SpellDetailsView.vue')
}
```

**Usage in components:**
```typescript
// Access route parameter
const route = useRoute()
const spellId = route.params.id
```

## 🚦 Navigation Patterns

### Programmatic Navigation
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigate to route
router.push({ name: 'spells' })
router.push('/spells')

// Navigate with parameters
router.push({ 
  name: 'spell-details', 
  params: { id: '123' } 
})

// Go back
router.back()
```

### Template Navigation
```vue
<template>
  <!-- Using router-link -->
  <router-link :to="{ name: 'spells' }">
    View Spells
  </router-link>
  
  <!-- With parameters -->
  <router-link :to="{ name: 'spell-details', params: { id: spell.id } }">
    {{ spell.name }}
  </router-link>
</template>
```

## 🔧 Configuration Details

### History Mode
```typescript
history: createWebHistory(import.meta.env.BASE_URL)
```
- Uses HTML5 History API
- Clean URLs without hash (#)
- Requires server configuration for SPA

### Base URL
- Uses `import.meta.env.BASE_URL` from Vite
- Configurable for different deployment environments
- Supports subdirectory deployments

### Meta Fields
```typescript
meta: { 
  requiresAuth: true,
  // Could extend with:
  // title: 'Page Title',
  // roles: ['admin'],
  // breadcrumb: 'Path'
}
```

## 🛡️ Security Features

### Authentication Integration
- **Pinia Store Integration** - Uses `useUserStore` for auth state
- **Reactive Guards** - Guards update when auth state changes
- **Consistent Redirects** - Predictable navigation flow

### Protection Strategy
1. **Check Authentication** - Verify user is logged in
2. **Route Validation** - Check if route requires auth
3. **Graceful Redirects** - Send to appropriate page
4. **User Feedback** - Console logging for debugging

## 🚀 Usage Examples

### Adding New Routes

#### Public Route
```typescript
{
  path: '/about',
  name: 'about',
  component: () => import('../views/AboutView.vue')
  // No meta.requiresAuth needed
}
```

#### Protected Route
```typescript
{
  path: '/admin',
  name: 'admin',
  component: () => import('../views/AdminView.vue'),
  meta: { requiresAuth: true }
}
```

#### Route with Parameters
```typescript
{
  path: '/elixirs/:id',
  name: 'elixir-details',
  component: () => import('../views/ElixirDetailsView.vue'),
  meta: { requiresAuth: true }
}
```

### Advanced Guard Example
```typescript
// Custom role-based guard
beforeEnter: (to, from, next) => {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'home' }) // Access denied
  } else {
    next()
  }
}
```

## 🎨 Navigation UI Integration

### Menu Configuration
Routes can be easily mapped to navigation menus:
```typescript
const menuItems = [
  { name: 'houses', label: 'Houses', icon: 'home' },
  { name: 'spells', label: 'Spells', icon: 'magic' },
  { name: 'elixirs', label: 'Elixirs', icon: 'flask' },
  { name: 'games', label: 'Games', icon: 'gamepad' },
  { name: 'favourites', label: 'Favourites', icon: 'heart' }
]
```

### Active Route Detection
```vue
<template>
  <nav>
    <router-link 
      v-for="item in menuItems"
      :key="item.name"
      :to="{ name: item.name }"
      :class="{ active: $route.name === item.name }"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>
```

## 🔍 Debugging & Development

### Route Information
```typescript
// Access current route
const route = useRoute()
console.log('Current route:', route.name)
console.log('Route params:', route.params)
console.log('Route query:', route.query)
console.log('Route meta:', route.meta)
```

### Navigation Debugging
The router includes console logging for authentication failures:
```typescript
console.log('Access denied: User not authenticated, redirecting to home')
```

## 📖 Best Practices

### Route Naming
- ✅ Use kebab-case for route names
- ✅ Use descriptive, consistent naming
- ✅ Group related routes with prefixes

### Component Loading
- ✅ Use lazy loading for better performance
- ✅ Eagerly load critical routes (Home, Login)
- ✅ Group related routes for code splitting

### Meta Configuration
- ✅ Keep meta fields simple and focused
- ✅ Use consistent meta field names
- ✅ Document custom meta fields

### Guard Implementation
- ✅ Keep guards simple and focused
- ✅ Handle all navigation scenarios
- ✅ Provide user feedback for denied access
- ✅ Use store reactivity for auth state

## 📚 Resources

- **[Vue Router Documentation](https://router.vuejs.org/)**
- **[Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)**
- **[Route Meta Fields](https://router.vuejs.org/guide/advanced/meta.html)**
- **[Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html)**

---

**Secure, performant routing with Vue Router 4** 🛣️