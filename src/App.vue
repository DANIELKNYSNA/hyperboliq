<script setup lang="ts">
import { provide } from 'vue';
import { RouterView } from 'vue-router'
import NavMenu from '@/components/common/NavMenu.vue'
import AppFooter from '@/components/common/AppFooter.vue';
import { useUiStore } from '@/stores/uiStore'
import ApiClient from '@/Api/ApiClient';
import { ApiClientsImpl } from '@/Api/ApiClients';
import PWAStatus from './components/PWAStatus.vue';

const uiStore = useUiStore()

// Create API client instances
const apiClient = new ApiClient()
const apiClients = new ApiClientsImpl()

// Provide API clients to all child components
provide('apiClient', apiClient)
provide('apiClients', apiClients)

</script>

<template>
  <div
    :class="uiStore.themeClass"
    class="min-h-screen bg-transparent transition-colors duration-200"
  >
    <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <NavMenu />
    </header>
    <main class="container mx-auto py-8 px-4">
      <PWAStatus />
      <RouterView />
    </main>
    <AppFooter text="© 2025 Wizard World. All rights reserved." />
  </div>
</template>

<style>
@import "./assets/main.css";
</style>
