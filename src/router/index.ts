import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'
import HomeView from '@/views/HomeView.vue'
import HousesView from '@/views/HousesView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    trackAs?: 'ElixirView' | 'HousesView' | 'SpellsView' | 'GamesView' | 'MyFavouritesView' | 'SpellsDetailsView' | 'HomeView'
    displayName?: string
    isDynamic?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        trackAs: 'HomeView',
        displayName: 'Home'
      }
    },
    {
      path: '/houses',
      name: 'houses',
      component: HousesView,
      meta: {
        requiresAuth: true,
        trackAs: 'HousesView',
        displayName: 'Hogwarts Houses'
      }
    },
    {
      path: '/spells',
      name: 'spells',
      component: () => import('../views/SpellsView.vue'),
      meta: {
        requiresAuth: true,
        trackAs: 'SpellsView',
        displayName: 'Spells & Enchantments'
      }
    },
    {
      path: '/spells/:id',
      name: 'spell-details',
      component: () => import('../views/SpellDetailsView.vue'),
      meta: {
        requiresAuth: true,
        trackAs: 'SpellsDetailsView',
        displayName: 'Spell Details',
        isDynamic: true
      }
    },
    {
      path: '/elixirs',
      name: 'elixirs',
      component: () => import('../views/ElixirsView.vue'),
      meta: {
        requiresAuth: true,
        trackAs: 'ElixirView',
        displayName: 'Magical Elixirs'
      }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
      meta: {
        requiresAuth: true,
        trackAs: 'GamesView',
        displayName: 'Wizarding Games'
      }
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('../views/MyFavouritesView.vue'),
      meta: {
        requiresAuth: true,
        trackAs: 'MyFavouritesView',
        displayName: 'My Favourites'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
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

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated) {
      next()
    } else {
      console.log('Access denied: User not authenticated, redirecting to home')
      next({ name: 'home' })
      return
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta?.trackAs) {
    const uiStore = useUiStore()
    if (to.meta.isDynamic) {
      uiStore.trackPageVisit(to.meta.trackAs, to.meta.displayName)
      console.log(`Tracked visit to dynamic page: ${to.meta.trackAs} (${to.meta.displayName})`)
    } else {
      uiStore.trackPageVisit(to.meta.trackAs, to.meta.displayName)
      console.log(`Tracked visit to: ${to.meta.trackAs} (${to.meta.displayName})`)
    }
  }
})

export default router