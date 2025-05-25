import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HomeView from '@/views/HomeView.vue'
import HousesView from '@/views/HousesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/houses',
      name: 'houses',
      component: HousesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/spells',
      name: 'spells',
      component: () => import('../views/SpellsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/spells/:id',
      name: 'spell-details',
      component: () => import('../views/SpellDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/elixirs',
      name: 'elixirs',
      component: () => import('../views/ElixirsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('../views/MyFavourites.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        // If user is already authenticated, redirect to home
        const userStore = useUserStore()
        if (userStore.isAuthenticated) {
          next({ name: 'home' })
        } else {
          next()
        }
      }
    }
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated) {
      next()
    } else {
      console.log('Access denied: User not authenticated, redirecting to home')
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router