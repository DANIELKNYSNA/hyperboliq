<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavMenu from '@/components/common/NavMenu.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-2">
        <NavMenu />
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <RouterView />
    </main>

    <footer class="bg-gray-800 text-white py-6 mt-12">
      <div class="container mx-auto px-4 text-center">
        <p>© 2025 Wizard World Explorer | Made with PrimeVue and Vue 3</p>
      </div>
    </footer>
  </div>
</template>

<style>
</style>