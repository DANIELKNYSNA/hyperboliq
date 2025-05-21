<script setup lang="ts">
import { ref, inject } from 'vue'
import Menubar from 'primevue/menubar'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faBuilding, faBolt, faFlask, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import type { MenuItem } from 'primevue/menuitem'

library.add(faHouse, faBuilding, faBolt, faFlask, faSun, faMoon)

const isDarkMode = inject('isDarkMode', ref(false))

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const icons = {
  home: faHouse,
  houses: faBuilding,
  spells: faBolt,
  elixirs: faFlask
}

const items = ref<MenuItem[]>([
  {
    label: 'Home',
    icon: 'home',
    to: '/',
  },
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
])
</script>

<template>
  <div class="w-full">
    <Menubar
      :model="items"
      class="custom-menubar bg-gradient-to-r from-purple-800 to-indigo-900 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-lg border-none"
    >
      <template #start>
        <div class="flex items-center ml-2">
          <img src="../assets/wizard-logo.png" alt="Wizard World" class="h-10 mr-2" />
        </div>
      </template>
      <template #item="{ item }">
        <router-link
          v-if="item.to"
          :to="item.to"
          class="p-menuitem-link"
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            class="flex items-center px-4 py-3 text-white hover:bg-purple-700 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            :class="{ 'bg-purple-700 dark:bg-gray-700 font-medium': isActive }"
          >
            <font-awesome-icon :icon="icons[item.icon as keyof typeof icons]" class="mr-3" />
            <span class="text-sm ml-1">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-full text-white hover:bg-purple-700 dark:hover:bg-gray-700 transition-colors"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <font-awesome-icon
            :icon="isDarkMode ? faSun : faMoon"
            class="text-xl"
          />
        </button>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>

/* Dark mode overrides for PrimeVue components */
:global(.dark) .custom-menubar :deep(.p-menubar),
:global(.dark) .custom-menubar :deep(.p-menuitem-content) {
  background-color: transparent;
}
</style>