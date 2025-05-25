<script setup lang="ts">
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { usePWA } from '@/composables/PWAUtil'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload, faTimes, faMobileAlt, faWifi, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
 library.add(
  faDownload,
  faTimes,
  faMobileAlt,
  faWifi,
  faCheckCircle
)

const {
  isOnline,
  offlineReady,
  showUpdatePrompt,
  canInstall,
  handleUpdate,
  handleInstall,
  closeUpdatePrompt
} = usePWA()

// Local state for showing offline ready notification
const showOfflineReady = ref(false)

// Show offline ready notification when it becomes true
watch(offlineReady, (newValue) => {
  if (newValue) {
    showOfflineReady.value = true
    // Auto hide after 5 seconds
    setTimeout(() => {
      showOfflineReady.value = false
    }, 5000)
  }
})
</script>

<template>
  <div class="fixed top-4 right-4 z-50 max-w-sm">
    <!-- Update Available Notification -->
    <Transition name="slide-down">
      <div
        v-if="showUpdatePrompt"
        class="bg-blue-600 text-white p-4 rounded-lg shadow-lg mb-2"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <FontAwesomeIcon :icon="faDownload" class="text-lg" />
            <div>
              <h4 class="font-semibold">Update Available</h4>
              <p class="text-sm opacity-90">A new version of the app is ready</p>
            </div>
          </div>
          <button
            @click="closeUpdatePrompt"
            class="text-white/70 hover:text-white"
          >
            <FontAwesomeIcon :icon="faTimes" />
          </button>
        </div>
        <div class="flex space-x-2 mt-3">
          <button
            @click="handleUpdate"
            class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
          >
            Update Now
          </button>
          <button
            @click="closeUpdatePrompt"
            class="px-3 py-1 text-white/70 hover:text-white text-sm transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </Transition>

    <!-- Install App Prompt -->
    <Transition name="slide-down">
      <div
        v-if="canInstall"
        class="bg-purple-600 text-white p-4 rounded-lg shadow-lg mb-2"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <FontAwesomeIcon :icon="faMobileAlt" class="text-lg" />
            <div>
              <h4 class="font-semibold">Install App</h4>
              <p class="text-sm opacity-90">Add Wizard World to your home screen</p>
            </div>
          </div>
          <button
            @click="canInstall = false"
            class="text-white/70 hover:text-white"
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div class="flex space-x-2 mt-3">
          <button
            @click="handleInstall"
            class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
          >
            Install
          </button>
          <button
            @click="canInstall = false"
            class="px-3 py-1 text-white/70 hover:text-white text-sm transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </Transition>

    <!-- Connection Status -->
    <Transition name="slide-down">
      <div
        v-if="!isOnline"
        class="bg-orange-600 text-white p-3 rounded-lg shadow-lg"
      >
        <div class="flex items-center space-x-2">
          <FontAwesomeIcon :icon="faWifi" class="text-lg" />
          <div>
            <h4 class="font-semibold text-sm">You're Offline</h4>
            <p class="text-xs opacity-90">Using cached content</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Offline Ready Notification -->
    <Transition name="slide-down">
      <div
        v-if="offlineReady && showOfflineReady"
        class="bg-green-600 text-white p-3 rounded-lg shadow-lg"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <FontAwesomeIcon :icon="faCheckCircle" class="text-lg" />
            <div>
              <h4 class="font-semibold text-sm">Ready for Offline</h4>
              <p class="text-xs opacity-90">App cached and ready to use offline</p>
            </div>
          </div>
          <button
            @click="showOfflineReady = false"
            class="text-white/70 hover:text-white"
          >
            <FontAwesomeIcon icon="times" class="text-xs" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>