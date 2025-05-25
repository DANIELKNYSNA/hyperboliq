# 🧙‍♂️ Wizard World - Hyperboliq Assessment

> A magical web application built with Vue 3, TypeScript, and the Composition API, bringing the wizarding world to your browser.

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)

## ✨ Features

- 🏠 **House Management** - Explore and manage Hogwarts houses with detailed information
- ⚡ **Spell Repository** - Comprehensive spell database with search and favorites
- 🧪 **Elixir Collection** - Browse and manage magical elixirs and potions
- 👤 **User Authentication** - Secure login and registration system with role-based access
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistent preferences
- 📊 **Quiz System** - Interactive quizzes with score tracking
- 💾 **Data Persistence** - State management with automatic data persistence
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface with PrimeVue components and custom styling

## 🛠️ Tech Stack

### Core Technologies
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** - Modern Vue development approach

### State Management & Routing
- **[Pinia](https://pinia.vuejs.org/)** - Modern state management for Vue
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js
- **[Pinia Plugin Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)** - Automatic state persistence

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
   git clone <repository-url>
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

## 🏗️ Project Structure

```
src/
├── assets/                      # Static assets & Global styles and themes
├── Api/                         # Api setup and clients
│   ├── clients/                 # All the individual api services
│   │   ├── service-elixirs.ts   # Service elixirs
│   │   ├── service-houses.ts    # Service houses
│   │   ├── service-spells.ts    # Service spells
│   ├── ApiClient.ts             # Api structure file
│   ├── ApiClients.ts            # Registering all the api service clients
│   ├── QueryClient.ts           # TanStack Query client (not used, but set up)
├── components/                  # Reusable Vue components
│   ├── common/                  # Shared components
├── interfaces/                  # Global Interfaces
├── router/                      # Vue Router configuration

├── stores/                      # Pinia stores
│   ├── userStore.ts             # User authentication & profile
│   ├── spellStore.ts            # Spell management
│   ├── elixirStore.ts           # Elixir management
│   ├── houseStore.ts            # House information
│   └── uiStore.ts               # UI state & preferences
├── views/                       # Page components
├── App.vue                      # Vue control page
└── main.ts                      # Config and plugin registrations

tests/
├── unit/
│   ├── components/      # Component tests
└── └── stores/          # Store tests
```

## 🧪 Testing

This project maintains high test coverage with comprehensive unit tests.

### Running Tests

```bash
# Run all tests
npm run test:unit

### Test Coverage

- **Components**: Comprehensive testing of all UI components including props, events, and user interactions
- **Stores**: Complete coverage of state management, actions, and computed properties
- **Type Safety**: TypeScript integration ensures type safety across the application

## 🎨 UI Components

The application uses a combination of custom components and PrimeVue components:

### Custom Components
- `UpdateSpellDialog` - Modal for editing spell information
- `UserProfile` - User profile management
- `ThemeToggle` - Dark/light mode switcher

### PrimeVue Integration
- Form controls (InputText, Dropdown, Textarea)
- Navigation (Menu, TabView)
- Feedback (Message, Toast)
- Data display (DataTable, Card)

## 🏪 State Management

The application uses Pinia for state management with the following stores:

- **`useUserStore`** - Authentication, user profile, and permissions
- **`useSpellStore`** - Spell data management and favorites
- **`useElixirStore`** - Elixir collection and management
- **`useHouseStore`** - Hogwarts house information
- **`useUiStore`** - UI preferences and tracking

All stores include:
- TypeScript interfaces for type safety
- Automatic persistence using pinia-plugin-persistedstate
- Comprehensive error handling

## 🎯 Authentication & Authorization

The application includes a complete authentication system (mocked on the Frontend and store run):

### Features
- User registration and login
- Role-based access control (user/admin)
- Profile management
- Session persistence
- Input validation and error handling

### Demo Credentials
- **Admin**: `admin@admin.com` / `Admin123`
- **Regular User**: Any valid email / password (min 6 characters)

## 🌙 Theming

The application supports both light and dark themes:

- Automatic theme persistence
- System preference detection
- Seamless theme switching
- Custom CSS variables for consistent theming

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Production Build

### Building for Production

```bash
npm run build
```

### Deployment Considerations

- The application generates static files in the `dist/` directory
- All assets are optimized and minified
- TypeScript is compiled and type-checked
- CSS is processed and optimized

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_APP_TITLE=Wizard World
VITE_API_BASE_URL=https://wizard-world-api.herokuapp.com/
```

### Vite Configuration

The project uses a custom Vite configuration with:
- TypeScript support
- Vue 3 integration
- Path aliases for clean imports
- Development server optimization

## 🤝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use Composition API for all components
- Implement proper error handling
- Write comprehensive tests for new components and stores

### Git Workflow
- Use meaningful commit messages
- Create feature branches for new development
- Ensure all tests pass before merging

### Type Safety
- Define interfaces for all data structures
- Use strict TypeScript configuration
- Leverage Vue 3's improved TypeScript support

## 📚 IDE Setup

### Recommended IDE
**[VSCode](https://code.visualstudio.com/)** with the following extensions:

#### Required Extensions
- **[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** - Vue 3 language support
- **[TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)** - Enhanced TypeScript support

#### Recommended Extensions
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - Code linting
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - Code formatting
- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)** - Tailwind autocomplete

### Important Note
**Disable Vetur** if you have it installed, as it conflicts with Volar.

## 📖 Additional Resources

- **[Vue 3 Documentation](https://vuejs.org/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Pinia Documentation](https://pinia.vuejs.org/)**
- **[PrimeVue Documentation](https://primevue.org/)**
- **[Vite Configuration Reference](https://vite.dev/config/)**
- **[Vitest Documentation](https://vitest.dev/)**

## 📄 License

This project is part of the Hyperboliq assessment and is for demonstration purposes.

---

<div align="center">

**Built with ❤️ using Vue 3, TypeScript, and modern web technologies**

</div>