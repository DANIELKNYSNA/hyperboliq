// src/composables/PWAUtil.ts
import { ref, onMounted, onUnmounted, computed, readonly } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

// NOTE FROM DANIEL to whoever looks at my code: There are many console.logs here, just to keep track of the PWA lifecycle events - messy console, but they help!!
export function usePWA() {
  const isOnline = ref(navigator.onLine)
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const canInstall = ref(false)
  const {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      console.log('PWA: Update available')
    },
    onOfflineReady() {
      console.log('PWA: App ready for offline use')
    }
  })
  const showUpdatePrompt = computed(() => needRefresh.value)
  const updateNetworkStatus = () => {
    const online = navigator.onLine
    console.log('Network status changed to:', online)
    isOnline.value = online
  }
  const handleUpdate = async () => {
    try {
      await updateServiceWorker(true)
      console.log('PWA: Updated successfully')
    } catch (error) {
      console.error('Failed to update PWA:', error)
    }
  }
  const handleInstall = async () => {
    if (!deferredPrompt.value) {
      console.log('No install prompt available')
      return
    }
    try {
      await deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice

      console.log('Install prompt result:', outcome)

      deferredPrompt.value = null
      canInstall.value = false
    } catch (error) {
      console.error('Install failed:', error)
    }
  }
  const closeUpdatePrompt = () => {
    console.log('Update prompt dismissed')
  }
  const connectionStatus = computed(() => {
    if (isOnline.value) {
      return offlineReady.value ? 'Online - App cached for offline use' : 'Online'
    }
    return 'Offline - Using cached data'
  })
  onMounted(() => {
    setTimeout(() => {
      const actualStatus = navigator.onLine
      console.log('Delayed network check:', actualStatus)
      isOnline.value = actualStatus
    }, 100)
    isOnline.value = navigator.onLine
    console.log('Initial network status:', navigator.onLine)
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('Install prompt intercepted')
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      canInstall.value = true
    })
    console.log('PWA initialized:', {
      offlineReady: offlineReady.value,
      needRefresh: needRefresh.value,
      isOnline: isOnline.value,
      navigatorOnline: navigator.onLine
    })
  })
  onUnmounted(() => {
    window.removeEventListener('online', updateNetworkStatus)
    window.removeEventListener('offline', updateNetworkStatus)
  })

  return {
    isOnline: readonly(isOnline),
    offlineReady: readonly(offlineReady),
    needRefresh: readonly(needRefresh),
    showUpdatePrompt: readonly(showUpdatePrompt),
    canInstall: readonly(canInstall),
    connectionStatus: readonly(connectionStatus),
    handleUpdate,
    handleInstall,
    closeUpdatePrompt
  }
}
