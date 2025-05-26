# 🧙‍♂️ Wizard World - Hyperboliq Assessment

> A magical web application built with Vue 3, TypeScript, and the Composition API, bringing the wizarding world to your browser with modern data management capabilities.

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

## ✨ Features

- 🏠 **House Management** - Explore and manage Hogwarts houses with detailed information and real-time updates
- ⚡ **Spell Repository** - Comprehensive spell database with advanced search, filtering, and favorites system
- 🧪 **Elixir Collection** - Browse and manage magical elixirs and potions with lazy loading and infinite scroll
- 👤 **User Authentication** - Secure login and registration system with role-based access control
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistent preferences
- 📊 **Quiz System** - Interactive quizzes with score tracking
- 💾 **Smart Data Management** - Intelligent caching and background sync with TanStack Query
- 📱 **Responsive Design** - Optimized for desktop and mobile devices with adaptive layouts
- 🎨 **Modern UI** - Beautiful interface with PrimeVue components and custom gradient styling
- 📦 **Progressive Web App** - Installable app with offline capabilities and service workers
- ⚡ **Performance Optimized** - Lazy loading, background refetching, and smart error handling

## 🛠️ Tech Stack

### Core Technologies
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** - Modern Vue development approach

### Data Management & API Integration
- **[TanStack Query Vue](https://tanstack.com/query/latest/docs/vue/overview)** - Powerful data synchronization for Vue
- **[Custom API Layer](./src/Api/)** - Structured API client with service-based architecture
- **[Smart Composables](./src/composables/)** - Reusable data fetching and state management logic

### State Management & Routing
- **[Pinia](https://pinia.vuejs.org/)** - Modern state management for Vue
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js
- **[Pinia Plugin Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)** - Automatic state persistence

### Progressive Web App
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - PWA integration with Workbox
- **[Workbox](https://developers.google.com/web/tools/workbox)** - Service worker libraries for caching strategies

### UI & Styling
- **[PrimeVue](https://primevue.org/)** - Rich UI component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Font Awesome](https://fontawesome.com/)** - Icon library

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Official testing utilities
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript linting rules

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm** (v8.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:DANIELKNYSNA/hyperboliq.git
   cd wizard-world-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run type-check` | Run TypeScript type checking |

## ⚡ TanStack Query Integration

This application leverages TanStack Query for advanced data management, providing superior user experience through intelligent caching, background updates, and optimistic UI patterns.

### Data Management Features

- **🔄 Automatic Background Refetching** - Data stays fresh without user intervention
- **💾 Intelligent Caching** - Reduces API calls and improves performance
- **🔁 Smart Retry Logic** - Automatic retry with exponential backoff for failed requests
- **⚡ Optimistic Updates** - Instant UI updates with automatic rollback on errors
- **🔀 Request Deduplication** - Multiple identical requests are automatically deduplicated
- **📊 Loading & Error States** - Built-in loading and error state management
- **🎯 Query Invalidation** - Selective cache invalidation for related data updates

### Query Configuration

The application uses a custom QueryClient configuration optimized for the Wizard World API:

```typescript
// src/Api/QueryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount, error) => {
        // Smart retry logic based on error type
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false // Don't retry client errors
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
  },
})
```

### Composables Architecture

The application uses a composable-based architecture for data fetching:

#### Houses Management
```typescript
// src/composables/useHouses.ts
const { houses, isLoading, isError, error, refetch } = useHouses()
const { house, isLoading, error } = useHouse(houseId)
```

#### Spells Management
```typescript
// src/composables/useSpells.ts
const { spells, isLoading, isError, error, refetch } = useSpells(filters)
const { spell, isLoading, error } = useSpell(spellId)
```

#### Elixirs Management
```typescript
// src/composables/useElixirs.ts
const { elixirs, isLoading, isError, error, refetch } = useElixirs(filters)
const { elixir, isLoading, error } = useElixir(elixirId)
```

### Query Key Management

Each data type uses a structured query key factory for efficient cache management:

```typescript
// Query Keys Factory Pattern
export const houseKeys = {
  all: ['houses'] as const,
  lists: () => [...houseKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...houseKeys.lists(), filters] as const,
  details: () => [...houseKeys.all, 'detail'] as const,
  detail: (id: string) => [...houseKeys.details(), id] as const,
}
```

## 📱 Progressive Web App (PWA)

This application is built as a Progressive Web App, providing native app-like experiences with offline functionality, installability, and enhanced caching strategies.

### PWA Features

- **📦 Installable** - Users can install the app directly from their browser
- **🔄 Auto-Update** - Service worker automatically updates when new versions are available
- **💾 Offline Support** - Core functionality works without internet connection
- **🖼️ Asset Caching** - Images and static assets are cached for faster loading
- **🌐 API Caching** - API responses are cached with intelligent strategies
- **⚡ Fast Loading** - Pre-cached resources for instant app startup

### Caching Strategies

The PWA implementation uses Workbox with the following caching strategies:

#### Static Assets (CacheFirst)
- Images (PNG, JPG, JPEG, SVG, GIF, WebP, ICO)
- Fonts (WOFF, WOFF2)
- Static resources cached for 30 days with up to 100 entries

#### API Calls (NetworkFirst)
- Wizard World API responses
- Falls back to cache when offline
- Cached for 24 hours with up to 50 entries
- **Note**: TanStack Query provides additional caching layer on top of service worker caching

### Testing PWA Functionality

To test the PWA features and offline capabilities:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

3. **Test PWA features**
   - Open the application in your browser (usually `http://localhost:4173`)
   - Open Developer Tools (F12)
   - Navigate to the **Application** tab
   - Check **Service Workers** section to verify registration
   - Test **offline functionality**:
     - Go to **Network** tab in DevTools
     - Enable **Offline** mode
     - Refresh the page and navigate through the app
     - Verify core functionality works without internet (cached data via TanStack Query)

4. **Test Installation**
   - Look for the "Install App" prompt in supported browsers
   - Or manually install via browser menu options
   - Test the installed app functionality

## 🏗️ Project Structure

```
src/
├── assets/                      # Static assets & Global styles and themes
├── composables/                 # Vue composables for data fetching and logic
│   ├── useApi.ts               # API client access composable
│   ├── useHouses.ts            # Houses data management with TanStack Query
│   ├── useSpells.ts            # Spells data management with TanStack Query
│   ├── useElixirs.ts           # Elixirs data management with TanStack Query
│   └── PWAUtil.ts              # PWA utility functions
├── Api/                         # API layer and client configuration
│   ├── clients/                 # Individual API service clients
│   │   ├── service-elixirs.ts   # Elixirs API service
│   │   ├── service-houses.ts    # Houses API service
│   │   └── service-spells.ts    # Spells API service
│   ├── ApiClient.ts             # Base API client with error handling
│   ├── ApiClients.ts            # API clients registry and factory
│   └── QueryClient.ts           # TanStack Query client configuration
├── components/                  # Reusable Vue components
│   ├── common/                  # Shared components across the app
│   └── UpdateSpellDialog.vue    # Spell editing modal component
├── interfaces/                  # TypeScript interfaces and types
│   ├── house.ts                # House-related interfaces
│   ├── spell.ts                # Spell-related interfaces
│   └── elixirs.ts              # Elixir-related interfaces
├── router/                      # Vue Router configuration
│   └── index.ts                # Routes definition and guards
├── stores/                      # Pinia stores for local state management
│   ├── userStore.ts            # User authentication & profile
│   ├── spellStore.ts           # Spell favorites and UI state
│   ├── elixirStore.ts          # Elixir favorites and UI state
│   ├── houseStore.ts           # House selection and preferences
│   └── uiStore.ts              # UI state & theme preferences
├── types/                       # Global TypeScript type definitions
│   └── pwa.d.ts                # PWA-related type definitions
├── views/                       # Page-level Vue components
│   ├── HousesView.vue          # Houses listing and management
│   ├── SpellsView.vue          # Spells listing with DataTable and cards
│   ├── SpellDetailView.vue     # Individual spell details page
│   ├── ElixirsView.vue         # Elixirs listing with lazy loading
│   ├── LoginView.vue           # Authentication page
│   └── ProfileView.vue         # User profile management
├── App.vue                      # Root Vue component with providers
└── main.ts                      # Application entry point and plugin setup

tests/
├── unit/
│   ├── components/              # Component tests
│   ├── composables/             # Composables tests
│   └── stores/                  # Store tests

public/
├── coin_home.png               # PWA icon (192x192)
├── Hogwarts-Crest.png          # PWA icon (512x512)
└── manifest.json               # PWA manifest (auto-generated)
```

## 🧪 Testing

This project maintains high test coverage with comprehensive unit tests including TanStack Query composables testing.

### Running Tests

```bash
# Run all tests
npm run test:unit

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage Areas

- **Components**: Comprehensive testing of all UI components including props, events, and user interactions
- **Stores**: Complete coverage of state management, actions, and computed properties
- **Composables**: Testing of TanStack Query integrations, data fetching, and error handling
- **API Clients**: Testing of API service methods and error scenarios
- **Type Safety**: TypeScript integration ensures type safety across the application

## 🎨 UI Components & User Experience

The application features a modern, responsive design with enhanced user experience patterns:

## 🎨 UI Components & User Experience

The application features a modern, responsive design with enhanced user experience patterns:

### Enhanced Mobile Experience
- **Lazy Loading Cards** - Progressive loading of content on mobile devices
- **Infinite Scroll** - Seamless content loading for spells and elixirs
- **Pull-to-Refresh** - Native-like refresh gestures
- **Adaptive Layouts** - Optimized layouts for different screen sizes

### Desktop Features
- **Advanced DataTables** - Sortable, filterable, and paginated data views
- **Real-time Search** - Instant search results with debouncing
- **Keyboard Navigation** - Full keyboard accessibility support

### Custom Components
- `UpdateSpellDialog` - Modal for editing spell information with validation
- `UserProfile` - Comprehensive user profile management
- `ThemeToggle` - Smooth dark/light mode transitions
- **Enhanced Cards** - Beautiful gradient designs with hover effects

### PrimeVue Integration
- Form controls (InputText, Dropdown, Textarea) with custom styling
- Navigation (Menu, TabView) with theme consistency
- Feedback (Message, Toast) with proper error handling
- Data display (DataTable, Card) with responsive design

## 🏪 State Management Architecture

The application uses a hybrid approach combining Pinia for local state and TanStack Query for server state:

### Pinia Stores (Local State)
- **`useUserStore`** - Authentication, user profile, and permissions
- **`useSpellStore`** - Spell favorites, selections, and UI state
- **`useElixirStore`** - Elixir favorites, liked items, and UI preferences
- **`useHouseStore`** - House selection, points, and user preferences
- **`useUiStore`** - Theme preferences, tracking, and global UI state

### TanStack Query (Server State)
- **API Data Management** - All server data fetching and caching
- **Background Sync** - Automatic data synchronization
- **Error Recovery** - Intelligent retry and error handling
- **Optimistic Updates** - Immediate UI feedback with rollback capabilities

All stores include:
- TypeScript interfaces for complete type safety
- Automatic persistence using pinia-plugin-persistedstate
- Comprehensive error handling and validation

## 🎯 Authentication & Authorization

The application includes a complete authentication system with enhanced security features:

### Features
- **Secure Registration** - Email validation and password strength requirements
- **Role-based Access Control** - User and admin permission levels
- **Profile Management** - Comprehensive user profile editing
- **Session Persistence** - Secure token management with automatic refresh
- **Input Validation** - Client and server-side validation
- **Error Handling** - User-friendly error messages and recovery

### Demo Credentials
- **Admin**: `admin@admin.com` / `Admin123`
- **Regular User**: Any valid email / password (min 6 characters)

### Security Features
- **JWT Token Management** - Secure token storage and refresh
- **Route Guards** - Protected routes based on authentication status
- **Permission Checks** - Component-level permission validation
- **Automatic Logout** - Session timeout handling

## 🌙 Advanced Theming

The application features a sophisticated theming system:

### Theme Features
- **Automatic Persistence** - Theme preferences saved across sessions
- **System Preference Detection** - Respects user's OS theme preference
- **Seamless Transitions** - Smooth animations between theme changes
- **Custom CSS Variables** - Consistent theming across all components
- **PrimeVue Integration** - Synchronized theme switching with component library

### Theme Implementation
- **CSS Custom Properties** - Dynamic theme variable management
- **Gradient Designs** - Beautiful gradient backgrounds and accents
- **Dark Mode Optimization** - Carefully designed dark theme for better readability
- **Accessibility Compliance** - Proper contrast ratios and WCAG guidelines

## 📱 Enhanced Responsive Design

The application provides optimal experiences across all device types:

### Responsive Breakpoints
- **Desktop** (1024px+) - Full-featured interface with advanced interactions
- **Tablet** (768px - 1023px) - Adapted layouts with touch-friendly controls
- **Mobile** (320px - 767px) - Streamlined interface with gesture support

### Mobile-First Features
- **Touch Gestures** - Swipe, pinch, and tap interactions
- **Lazy Loading** - Progressive content loading for better performance
- **Adaptive Components** - Components that change behavior based on screen size
- **Offline Indicators** - Clear feedback about connectivity status

## 🚀 Production Build & Performance

### Building for Production

```bash
npm run build
```

### Performance Optimizations

- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Elimination of unused code
- **Asset Optimization** - Compressed images and minified assets
- **TanStack Query** - Intelligent data caching and background updates
- **Service Worker** - Advanced caching strategies for offline performance
- **Bundle Analysis** - Optimized bundle sizes for faster loading

### Deployment Considerations

- **Static Generation** - Optimized static files in `dist/` directory
- **CDN Ready** - All assets optimized for CDN deployment
- **Progressive Enhancement** - Core functionality works without JavaScript
- **SEO Optimization** - Meta tags and structured data for better discoverability

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Wizard World
VITE_API_BASE_URL=https://wizard-world-api.herokuapp.com/
VITE_ENABLE_PWA=true
VITE_ENABLE_DEVTOOLS=true
```

### TanStack Query Configuration

```typescript
// Customizable query defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // How long data stays fresh
      gcTime: 10 * 60 * 1000,       // How long data stays in cache
      retry: 3,                      // Number of retry attempts
      refetchOnWindowFocus: false,   // Disable refetch on window focus
    },
    mutations: {
      retry: 1,                      // Retry failed mutations once
    },
  },
})
```

### Vite Configuration

The project uses an advanced Vite configuration with:
- **TypeScript Support** - Full TypeScript integration with strict mode
- **Vue 3 Optimization** - Optimized Vue 3 compilation and HMR
- **Path Aliases** - Clean import paths throughout the application
- **Development Server** - Hot reload with fast refresh
- **PWA Plugin** - Complete PWA integration with Workbox
- **Tailwind CSS** - PostCSS processing with Tailwind utilities
- **Bundle Optimization** - Advanced chunking and compression strategies

## 🤝 Development Guidelines

### Code Architecture Patterns
- **Composition API** - Consistent use of Vue 3 Composition API
- **Composables Pattern** - Reusable logic extraction into composables
- **Service Layer** - Clean separation between API calls and components
- **Type-First Development** - TypeScript interfaces defined before implementation

### Data Flow Patterns
- **Unidirectional Data Flow** - Clear data flow from API → Query → Component
- **Separation of Concerns** - Server state (TanStack Query) vs Local state (Pinia)
- **Error Boundaries** - Comprehensive error handling at multiple levels
- **Loading States** - Consistent loading indicators across the application

### Code Style & Standards
- **TypeScript Best Practices** - Strict typing with comprehensive interfaces
- **Vue 3 Standards** - Modern Vue development patterns
- **Error Handling** - Graceful degradation and user-friendly error messages
- **Testing Coverage** - Comprehensive unit tests for critical functionality

### Git Workflow
- **Feature Branches** - All development in feature branches
- **Meaningful Commits** - Clear, descriptive commit messages
- **Code Review** - All changes reviewed before merging
- **Testing Requirements** - All tests must pass before merging

## 📚 IDE Setup & Development Experience

### Recommended IDE Setup
**[VSCode](https://code.visualstudio.com/)** with the following extensions:

#### Required Extensions
- **[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** - Vue 3 language support and IntelliSense
- **[TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)** - Enhanced TypeScript support for Vue

#### Recommended Extensions
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - Real-time code linting
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - Consistent code formatting
- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)** - Tailwind class autocomplete
- **[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)** - Automatic HTML/Vue tag renaming
- **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)** - Enhanced Git integration

### Development Tools Integration
- **Vue DevTools** - Browser extension for Vue debugging
- **TanStack Query DevTools** - Built-in query debugging interface
- **Vite HMR** - Instant hot module replacement during development
- **TypeScript Language Server** - Real-time type checking and IntelliSense

### Important Notes
- **Disable Vetur** if installed - Conflicts with Volar
- **Enable TypeScript strict mode** - Recommended for better type safety
- **Configure auto-save** - For optimal development experience with HMR

## 📖 Additional Resources & Documentation

### Core Technologies
- **[Vue 3 Documentation](https://vuejs.org/)** - Complete Vue 3 guide and API reference
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Comprehensive TypeScript documentation
- **[TanStack Query Vue](https://tanstack.com/query/latest/docs/vue/overview)** - Vue integration guide for TanStack Query
- **[Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)** - Modern Vue development patterns

### State Management & Data Fetching
- **[Pinia Documentation](https://pinia.vuejs.org/)** - Modern state management for Vue
- **[TanStack Query Guide](https://tanstack.com/query/latest/docs/react/guides/queries)** - Data fetching best practices
- **[Vue Query Examples](https://tanstack.com/query/latest/docs/vue/examples/simple)** - Practical implementation examples

### UI & Styling
- **[PrimeVue Documentation](https://primevue.org/)** - Complete component library reference
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[Font Awesome Icons](https://fontawesome.com/icons)** - Icon library reference

### Build Tools & Development
- **[Vite Configuration Reference](https://vite.dev/config/)** - Build tool configuration
- **[Vitest Documentation](https://vitest.dev/)** - Fast unit testing framework
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Vue component testing utilities

### Progressive Web Apps
- **[Vite PWA Plugin Documentation](https://vite-pwa-org.netlify.app/)** - PWA integration guide
- **[Workbox Documentation](https://developers.google.com/web/tools/workbox)** - Service worker strategies
- **[PWA Best Practices](https://web.dev/progressive-web-apps/)** - Web.dev PWA guidelines
- **[PWA Checklist](https://web.dev/pwa-checklist/)** - Comprehensive PWA implementation guide

### Performance & Optimization
- **[Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html)** - Vue-specific optimization tips
- **[Web Vitals](https://web.dev/vitals/)** - Core web performance metrics
- **[TanStack Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)** - Query optimization strategies

## 📄 License

This project is part of the Hyperboliq assessment and is for demonstration purposes.

---

<div align="center">

**Built with ❤️ using Vue 3, TypeScript, TanStack Query, and modern web technologies**

*Enhanced with Progressive Web App capabilities and intelligent data management for the ultimate user experience*

</div>
