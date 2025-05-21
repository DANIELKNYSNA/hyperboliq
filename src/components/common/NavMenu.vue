<script setup lang="ts">
import { ref } from 'vue'
import Menubar from 'primevue/menubar'

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home', // Using PrimeIcons instead of FontAwesome
    to: '/',
  },
  {
    label: 'Houses',
    icon: 'pi pi-building',
    to: '/houses',
  },
  {
    label: 'Spells',
    icon: 'pi pi-bolt',
    to: '/spells',
  },
  {
    label: 'Elixirs',
    icon: 'pi pi-flask',
    to: '/elixirs',
  },
])
</script>

<template>
  <div class="w-full">
    <Menubar
      :model="items"
      class="bg-gradient-to-r from-purple-800 to-indigo-900 shadow-lg rounded-lg border-none"
    >
      <template #start>
        <div class="flex items-center ml-2">
          <img src="../assets/wizard-logo.png" alt="Wizard World" class="h-10 mr-2" />
          <h1 class="text-white text-xl font-bold">Wizard World</h1>
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
            class="flex items-center px-4 py-3 text-white hover:bg-purple-700 rounded-md transition-colors duration-200"
            :class="{ 'bg-purple-700 font-medium': isActive }"
          >
            <span v-if="item.icon" :class="['mr-3', item.icon]"></span>
            <span class="text-sm">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
/* Override PrimeVue styles if needed */
/* :deep(.p-menubar) {
  padding: 0.75rem;
  border: none;
}

:deep(.p-menubar-root-list) {
  gap: 0.5rem;
}

:deep(.p-menuitem-content) {
  border-radius: 0.375rem;
} */
</style>