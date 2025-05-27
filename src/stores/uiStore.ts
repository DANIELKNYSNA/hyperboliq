import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface TrackerInterface {
  totalVisitCount: number
  lastViewedSpell: string
  pageVisits: {
    ElixirView: number
    GamesView: number
    HomeView: number
    HousesView: number
    SpellsView: number
    MyFavouritesView: number
    SpellsDetailsView: number
  }
  pageNames: {
    ElixirView: string
    GamesView: string
    HomeView: string
    HousesView: string
    SpellsView: string
    MyFavouritesView: string
    SpellsDetailsView: string
  }
  lastVisitedPage: string
  lastVisitedPageDisplayName: string
  visitHistory: Array<{ page: string; displayName: string; timestamp: string }>
}

type PageName = keyof TrackerInterface['pageVisits']

interface VisitHistoryEntry {
  page: string
  displayName: string
  timestamp: string
}

export const useUiStore = defineStore('uiStore', () => {
  const isDarkMode = ref<boolean>(false)
  const tracker = ref<TrackerInterface>({
    totalVisitCount: 0,
    lastViewedSpell: '',
    pageVisits: {
      ElixirView: 0,
      HousesView: 0,
      SpellsView: 0,
      GamesView: 0,
      HomeView: 0,
      MyFavouritesView: 0,
      SpellsDetailsView: 0
    },
    pageNames: {
      ElixirView: 'Magical Elixirs',
      HousesView: 'Hogwarts Houses',
      SpellsView: 'Spells & Enchantments',
      GamesView: 'Wizarding Games',
      HomeView: 'Home',
      MyFavouritesView: 'My Favourites',
      SpellsDetailsView: 'Spell Details'
    },
    lastVisitedPage: '',
    lastVisitedPageDisplayName: '',
    visitHistory: []
  })

  const themeClass = computed<string>(() => isDarkMode.value ? 'dark' : '')

  const toggleDarkMode = (): void => {
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

  const trackPageVisit = (pageName: PageName, displayName?: string): void => {
    if (!tracker.value.pageVisits.hasOwnProperty(pageName)) {
      console.warn(`Unknown page: ${pageName}`)
      return
    }
    const pageDisplayName = displayName || tracker.value.pageNames[pageName]
    tracker.value.totalVisitCount++
    tracker.value.pageVisits[pageName]++
    tracker.value.lastVisitedPage = pageName
    tracker.value.lastVisitedPageDisplayName = pageDisplayName

    const historyEntry: VisitHistoryEntry = {
      page: pageName,
      displayName: pageDisplayName,
      timestamp: new Date().toISOString()
    }
    tracker.value.visitHistory.unshift(historyEntry)
    if (tracker.value.visitHistory.length > 10) {
      tracker.value.visitHistory = tracker.value.visitHistory.slice(0, 10)
    }
  }

  const updatePageDisplayName = (pageName: PageName, displayName: string): void => {
    if (!tracker.value.pageVisits.hasOwnProperty(pageName)) {
      console.warn(`Unknown page: ${pageName}`)
      return
    }
    tracker.value.pageNames[pageName] = displayName
    if (tracker.value.lastVisitedPage === pageName) {
      tracker.value.lastVisitedPageDisplayName = displayName
    }
  }

  const getPageVisitCount = (pageName: PageName): number => {
    return tracker.value.pageVisits[pageName] || 0
  }

  const getPageDisplayName = (pageName: PageName): string => {
    return tracker.value.pageNames[pageName] || pageName
  }

  const getMostVisitedPage = computed<PageName | null>(() => {
    const visits = tracker.value.pageVisits
    const maxVisits = Math.max(...Object.values(visits))
    if (maxVisits === 0) return null
    return (Object.keys(visits) as PageName[]).find(page => visits[page] === maxVisits) || null
  })

  const getMostVisitedPageDisplayName = computed<string | null>(() => {
    const mostVisited = getMostVisitedPage.value
    return mostVisited ? tracker.value.pageNames[mostVisited] : null
  })

  const getVisitHistoryWithNames = computed(() => {
    return tracker.value.visitHistory.map(entry => ({
      ...entry,
      displayName: entry.displayName || tracker.value.pageNames[entry.page as PageName] || entry.page
    }))
  })

  return {
    isDarkMode,
    tracker,
    themeClass,
    toggleDarkMode,
    trackPageVisit,
    updatePageDisplayName,
    getPageVisitCount,
    getPageDisplayName,
    getMostVisitedPage,
    getMostVisitedPageDisplayName,
    getVisitHistoryWithNames
  }
},
{
  persist: true
})