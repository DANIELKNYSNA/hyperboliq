<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faBuilding, faBolt, faFlask, faSun, faMoon, faUser, faSignOutAlt, faWandMagicSparkles  } from '@fortawesome/free-solid-svg-icons'
import type { MenuItem } from 'primevue/menuitem'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'

library.add(faHouse, faBuilding, faBolt, faFlask, faSun, faMoon, faUser, faSignOutAlt, faWandMagicSparkles)

const router = useRouter()
const uiStore = useUiStore()
const userStore = useUserStore()

const isDarkMode = computed(() => uiStore.isDarkMode)
const isAuthenticated = computed(() => userStore.isAuthenticated)

const icons = {
  home: faHouse,
  houses: faBuilding,
  spells: faBolt,
  elixirs: faFlask,
  login: faUser,
  logout: faSignOutAlt,
  games: faWandMagicSparkles
}

const items = computed<MenuItem[]>(() => {
  const baseItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      to: '/',
    }
  ]

  if (isAuthenticated.value) {
    return [
      ...baseItems,
      {
        label: 'Houses',
        icon: 'houses',
        to: '/houses',
      },
      {
        label: 'Spells',
        icon: 'spells',
        to: '/spells',
      },
      {
        label: 'Elixirs',
        icon: 'elixirs',
        to: '/elixirs',
      },
      {
        label: 'Games',
        icon: 'games',
        to: '/games',
      },
      {
        label: 'Logout',
        icon: 'logout',
        command: handleLogout,
      }
    ]
  }

  // If user is not authenticated, only show Home and Login
  return [
    ...baseItems,
    {
      label: 'Login',
      icon: 'login',
      to: '/login',
    }
  ]
})

// Handle logout functionality
const handleLogout = async () => {
  try {
    userStore.logout()
    // Redirect to home page after logout
    await router.push('/')
    console.log('User logged out successfully')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="w-full">
    <Menubar
      :model="items"
      class="custom-menubar"
    >
      <template #start>
        <div class="flex items-center ml-2">
          <img src="../../assets/images/Hogwarts-Crest.png" alt="Wizard World" class="h-10 mr-2" />
        </div>
      </template>
      <template #item="{ item }">
        <!-- Handle regular navigation items -->
        <router-link
          v-if="item.to"
          :to="item.to"
          class="p-menuitem-link"
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            class="flex items-center px-4 py-3 hover:bg-gray-400 hover:text-gray-100 rounded-md transition-colors duration-200"
            :class="{
              [isDarkMode ? 'bg-purple-700' : 'bg-gray-700' ]: isActive,
              'font-medium': isActive,
              'hover:bg-purple-700': isDarkMode,
              'text-gray-100': isDarkMode || isActive,
              'text-gray-400': !isDarkMode && !isActive
            }"
          >
            <font-awesome-icon :icon="icons[item.icon as keyof typeof icons]" class="mr-3" />
            <span class="text-lg ml-1">{{ item.label }}</span>
          </a>
        </router-link>

        <!-- Handle logout button (command-based items) -->
        <Button
          v-else-if="item.command"
          @click="(e: MouseEvent) => item.command?.({ originalEvent: e, item })"
          class="flex items-center px-4 py-3 hover:bg-gray-400 hover:text-gray-100 rounded-md transition-colors duration-200 w-full text-left"
          :class="{
            'hover:bg-purple-700': isDarkMode,
            'text-gray-100': isDarkMode,
            'text-gray-400': !isDarkMode
          }"
        >
          <font-awesome-icon :icon="icons[item.icon as keyof typeof icons]" class="mr-3" />
          <span class="text-lg ml-1">{{ item.label }}</span>
        </Button>
      </template>
      <template #end>
        <template v-if="isAuthenticated">
          <Avatar
            :label="userStore.userInitials"
            class="mr-4 cursor-pointer"
            size="xlarge"
            :style="isDarkMode ? 'background-color: #ece9fc; color: #2a1261' : 'background-color: #2a1261; color: #ece9fc'"
            shape="circle"
            @click="() => router.push('/favourites')"
          />
        </template>
        <button
          @click="uiStore.toggleDarkMode"
          class="p-2 rounded-full text-black hover:bg-purple-700 dark:hover:bg-gray-700 transition-colors"
          :class="isDarkMode ? 'text-white' : 'text-black'"
          :title="uiStore.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <font-awesome-icon
            :icon="uiStore.isDarkMode ? faSun : faMoon"
            class="text-xl"
          />
        </button>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
@import '../../assets/nav.css';
</style>