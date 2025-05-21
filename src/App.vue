<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavMenu from '@/components/common/NavMenu.vue'
import AppFooter from './components/common/AppFooter.vue';
import { ref, provide } from 'vue'
const isDarkMode = ref(false)
provide('isDarkMode', isDarkMode)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-md sticky top-0 z-50">
      <NavMenu />
    </header>
    <main class="container mx-auto py-8 px-4">
      <RouterView />
    </main>
    <AppFooter text="© 2023 Wizard World. All rights reserved." />
  </div>
</template>

<style>
.dark .p-card {
  background-color: #2d3748;
  color: #f7fafc;
}

.dark .p-card .p-card-title {
  color: #f7fafc;
}

.dark .p-card .p-card-content {
  color: #e2e8f0;
}

.dark .p-button {
  background-color: #4c1d95;
  border-color: #4c1d95;
}

.dark .p-button:hover {
  background-color: #5b21b6;
  border-color: #5b21b6;
}
</style>