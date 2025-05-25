import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('uiStore', () => {
  const isDarkMode = ref(false)
  const tracker = ref({
    visitCount: 0,
    lastViewedSpell: '',
  })

  const themeClass = computed(() => isDarkMode.value ? 'dark' : '')

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    try {
      if (document.body?.classList) {
        if (isDarkMode.value) {
          document.body.classList.add('dark')
        } else {
          document.body.classList.remove('dark')
        }
      }
    } catch (error) {
      console.warn('Failed to update DOM classes:', error)
    }
  }

  return {
    isDarkMode,
    tracker,
    themeClass,
    toggleDarkMode
  }
},
{
  persist: true
})