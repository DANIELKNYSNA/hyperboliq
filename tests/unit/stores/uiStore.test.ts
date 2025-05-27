// tests/unit/stores/uiStore.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUiStore } from '../../../src/stores/uiStore'

// Mock the persistence plugin if needed
vi.mock('pinia-plugin-persistedstate', () => ({
  default: () => ({})
}))

describe('useUiStore', () => {
  let store: ReturnType<typeof useUiStore>

  // Mock document.body for DOM manipulation tests
  const mockClassList = {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
    toggle: vi.fn()
  }

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useUiStore()

    // Mock document.body.classList
    Object.defineProperty(document, 'body', {
      value: {
        classList: mockClassList
      },
      writable: true
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up mocks
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.isDarkMode).toBe(false)
      expect(store.tracker).toEqual({
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
    })

    it('should be a Pinia store with correct store id', () => {
      expect(store.$id).toBe('uiStore')
    })

    it('should have all expected state properties, computed properties, and actions', () => {
      // State
      expect(store).toHaveProperty('isDarkMode')
      expect(store).toHaveProperty('tracker')

      // Computed
      expect(store).toHaveProperty('themeClass')
      expect(store).toHaveProperty('getMostVisitedPage')
      expect(store).toHaveProperty('getMostVisitedPageDisplayName')
      expect(store).toHaveProperty('getVisitHistoryWithNames')

      // Actions
      expect(store).toHaveProperty('toggleDarkMode')
      expect(store).toHaveProperty('trackPageVisit')
      expect(store).toHaveProperty('updatePageDisplayName')
      expect(store).toHaveProperty('getPageVisitCount')
      expect(store).toHaveProperty('getPageDisplayName')

      // Check function types
      expect(typeof store.toggleDarkMode).toBe('function')
      expect(typeof store.trackPageVisit).toBe('function')
      expect(typeof store.updatePageDisplayName).toBe('function')
      expect(typeof store.getPageVisitCount).toBe('function')
      expect(typeof store.getPageDisplayName).toBe('function')
    })
  })

  describe('isDarkMode State Management', () => {
    it('should allow setting isDarkMode to true', () => {
      store.isDarkMode = true
      expect(store.isDarkMode).toBe(true)
    })

    it('should allow setting isDarkMode to false', () => {
      store.isDarkMode = true
      expect(store.isDarkMode).toBe(true)

      store.isDarkMode = false
      expect(store.isDarkMode).toBe(false)
    })

    it('should maintain reactivity when isDarkMode changes', () => {
      expect(store.isDarkMode).toBe(false)

      store.isDarkMode = true
      expect(store.isDarkMode).toBe(true)

      store.isDarkMode = false
      expect(store.isDarkMode).toBe(false)
    })
  })

  describe('tracker State Management', () => {
    it('should allow updating totalVisitCount', () => {
      store.tracker.totalVisitCount = 5
      expect(store.tracker.totalVisitCount).toBe(5)
    })

    it('should allow updating lastViewedSpell', () => {
      store.tracker.lastViewedSpell = 'spell-123'
      expect(store.tracker.lastViewedSpell).toBe('spell-123')
    })

    it('should allow updating pageVisits', () => {
      store.tracker.pageVisits.SpellsView = 10
      expect(store.tracker.pageVisits.SpellsView).toBe(10)
    })

    it('should allow updating pageNames', () => {
      store.tracker.pageNames.SpellsView = 'Custom Spells Page'
      expect(store.tracker.pageNames.SpellsView).toBe('Custom Spells Page')
    })

    it('should allow updating lastVisitedPage', () => {
      store.tracker.lastVisitedPage = 'HousesView'
      expect(store.tracker.lastVisitedPage).toBe('HousesView')
    })

    it('should allow updating lastVisitedPageDisplayName', () => {
      store.tracker.lastVisitedPageDisplayName = 'Custom House Page'
      expect(store.tracker.lastVisitedPageDisplayName).toBe('Custom House Page')
    })

    it('should allow updating visitHistory', () => {
      const historyEntry = {
        page: 'SpellsView',
        displayName: 'Spells & Enchantments',
        timestamp: '2023-12-01T10:00:00.000Z'
      }
      store.tracker.visitHistory = [historyEntry]
      expect(store.tracker.visitHistory).toEqual([historyEntry])
    })

    it('should handle incremental updates to totalVisitCount', () => {
      expect(store.tracker.totalVisitCount).toBe(0)

      store.tracker.totalVisitCount++
      expect(store.tracker.totalVisitCount).toBe(1)

      store.tracker.totalVisitCount += 5
      expect(store.tracker.totalVisitCount).toBe(6)
    })

    it('should maintain object structure when updating individual properties', () => {
      store.tracker.totalVisitCount = 5
      expect(store.tracker.lastViewedSpell).toBe('') // Should remain unchanged

      store.tracker.lastViewedSpell = 'spell-456'
      expect(store.tracker.totalVisitCount).toBe(5) // Should remain unchanged
    })
  })

  describe('themeClass Computed Property', () => {
    it('should return empty string when isDarkMode is false', () => {
      store.isDarkMode = false
      expect(store.themeClass).toBe('')
    })

    it('should return "dark" when isDarkMode is true', () => {
      store.isDarkMode = true
      expect(store.themeClass).toBe('dark')
    })

    it('should be reactive to isDarkMode changes', () => {
      expect(store.themeClass).toBe('') // Initially false

      store.isDarkMode = true
      expect(store.themeClass).toBe('dark')

      store.isDarkMode = false
      expect(store.themeClass).toBe('')
    })

    it('should update when toggling dark mode', () => {
      expect(store.themeClass).toBe('')

      store.toggleDarkMode()
      expect(store.themeClass).toBe('dark')

      store.toggleDarkMode()
      expect(store.themeClass).toBe('')
    })
  })

  describe('toggleDarkMode Action', () => {
    it('should toggle isDarkMode from false to true', () => {
      expect(store.isDarkMode).toBe(false)

      store.toggleDarkMode()

      expect(store.isDarkMode).toBe(true)
    })

    it('should toggle isDarkMode from true to false', () => {
      store.isDarkMode = true

      store.toggleDarkMode()

      expect(store.isDarkMode).toBe(false)
    })

    it('should add "dark" class to document.body when enabling dark mode', () => {
      store.toggleDarkMode()

      expect(mockClassList.add).toHaveBeenCalledWith('dark')
      expect(mockClassList.add).toHaveBeenCalledTimes(1)
    })

    it('should remove "dark" class from document.body when disabling dark mode', () => {
      store.isDarkMode = true

      store.toggleDarkMode()

      expect(mockClassList.remove).toHaveBeenCalledWith('dark')
      expect(mockClassList.remove).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple toggles correctly', () => {
      // First toggle: false -> true
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(true)
      expect(mockClassList.add).toHaveBeenCalledWith('dark')

      // Second toggle: true -> false
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(false)
      expect(mockClassList.remove).toHaveBeenCalledWith('dark')

      // Third toggle: false -> true
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(true)
      expect(mockClassList.add).toHaveBeenCalledWith('dark')

      expect(mockClassList.add).toHaveBeenCalledTimes(2)
      expect(mockClassList.remove).toHaveBeenCalledTimes(1)
    })

    it('should update themeClass when toggling', () => {
      expect(store.themeClass).toBe('')

      store.toggleDarkMode()
      expect(store.themeClass).toBe('dark')

      store.toggleDarkMode()
      expect(store.themeClass).toBe('')
    })

    it('should not affect tracker state when toggling dark mode', () => {
      store.tracker.totalVisitCount = 5
      store.tracker.lastViewedSpell = 'spell-789'

      store.toggleDarkMode()

      expect(store.tracker.totalVisitCount).toBe(5)
      expect(store.tracker.lastViewedSpell).toBe('spell-789')
    })
  })

  describe('trackPageVisit Action', () => {
    it('should increment totalVisitCount when tracking a page visit', () => {
      expect(store.tracker.totalVisitCount).toBe(0)

      store.trackPageVisit('SpellsView')

      expect(store.tracker.totalVisitCount).toBe(1)
    })

    it('should increment specific page visit count', () => {
      expect(store.tracker.pageVisits.SpellsView).toBe(0)

      store.trackPageVisit('SpellsView')

      expect(store.tracker.pageVisits.SpellsView).toBe(1)
    })

    it('should update lastVisitedPage', () => {
      store.trackPageVisit('HousesView')

      expect(store.tracker.lastVisitedPage).toBe('HousesView')
    })

    it('should update lastVisitedPageDisplayName with default name', () => {
      store.trackPageVisit('SpellsView')

      expect(store.tracker.lastVisitedPageDisplayName).toBe('Spells & Enchantments')
    })

    it('should update lastVisitedPageDisplayName with custom name', () => {
      store.trackPageVisit('SpellsDetailsView', 'Spell: Expelliarmus')

      expect(store.tracker.lastVisitedPageDisplayName).toBe('Spell: Expelliarmus')
    })

    it('should add entry to visitHistory', () => {
      const beforeTimestamp = new Date().getTime()

      store.trackPageVisit('ElixirView', 'Custom Elixir Page')

      const afterTimestamp = new Date().getTime()

      expect(store.tracker.visitHistory).toHaveLength(1)

      const historyEntry = store.tracker.visitHistory[0]
      expect(historyEntry.page).toBe('ElixirView')
      expect(historyEntry.displayName).toBe('Custom Elixir Page')

      const entryTimestamp = new Date(historyEntry.timestamp).getTime()
      expect(entryTimestamp).toBeGreaterThanOrEqual(beforeTimestamp)
      expect(entryTimestamp).toBeLessThanOrEqual(afterTimestamp)
    })

    it('should limit visitHistory to 10 entries', () => {
      // Add 12 entries
      for (let i = 0; i < 12; i++) {
        store.trackPageVisit('SpellsView', `Visit ${i}`)
      }

      expect(store.tracker.visitHistory).toHaveLength(10)

      // Most recent should be first
      expect(store.tracker.visitHistory[0].displayName).toBe('Visit 11')
      expect(store.tracker.visitHistory[9].displayName).toBe('Visit 2')
    })

    it('should handle multiple visits to different pages', () => {
      store.trackPageVisit('SpellsView')
      store.trackPageVisit('HousesView')
      store.trackPageVisit('ElixirView')

      expect(store.tracker.totalVisitCount).toBe(3)
      expect(store.tracker.pageVisits.SpellsView).toBe(1)
      expect(store.tracker.pageVisits.HousesView).toBe(1)
      expect(store.tracker.pageVisits.ElixirView).toBe(1)
      expect(store.tracker.lastVisitedPage).toBe('ElixirView')
    })

    it('should warn for unknown page names', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // @ts-expect-error - Testing invalid page name
      store.trackPageVisit('InvalidPage')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown page: InvalidPage')

      consoleWarnSpy.mockRestore()
    })

    it('should not update counts for unknown page names', () => {
      const initialTotalCount = store.tracker.totalVisitCount

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // @ts-expect-error - Testing invalid page name
      store.trackPageVisit('InvalidPage')

      expect(store.tracker.totalVisitCount).toBe(initialTotalCount)

      consoleWarnSpy.mockRestore()
    })
  })

  describe('updatePageDisplayName Action', () => {
    it('should update page display name', () => {
      store.updatePageDisplayName('SpellsView', 'Custom Spells Title')

      expect(store.tracker.pageNames.SpellsView).toBe('Custom Spells Title')
    })

    it('should update lastVisitedPageDisplayName if it matches current page', () => {
      store.trackPageVisit('HousesView')
      store.updatePageDisplayName('HousesView', 'Updated Houses Page')

      expect(store.tracker.lastVisitedPageDisplayName).toBe('Updated Houses Page')
    })

    it('should not update lastVisitedPageDisplayName if it does not match current page', () => {
      store.trackPageVisit('SpellsView')
      store.updatePageDisplayName('HousesView', 'Updated Houses Page')

      expect(store.tracker.lastVisitedPageDisplayName).toBe('Spells & Enchantments')
    })

    it('should warn for unknown page names', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // @ts-expect-error - Testing invalid page name
      store.updatePageDisplayName('InvalidPage', 'Some Title')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown page: InvalidPage')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('getPageVisitCount Action', () => {
    it('should return correct visit count for a page', () => {
      store.trackPageVisit('GamesView')
      store.trackPageVisit('GamesView')
      store.trackPageVisit('GamesView')

      expect(store.getPageVisitCount('GamesView')).toBe(3)
    })

    it('should return 0 for unvisited pages', () => {
      expect(store.getPageVisitCount('ElixirView')).toBe(0)
    })
  })

  describe('getPageDisplayName Action', () => {
    it('should return default display name', () => {
      expect(store.getPageDisplayName('SpellsView')).toBe('Spells & Enchantments')
    })

    it('should return updated display name', () => {
      store.updatePageDisplayName('SpellsView', 'Custom Spells Page')

      expect(store.getPageDisplayName('SpellsView')).toBe('Custom Spells Page')
    })

    it('should return page name as fallback for unknown pages', () => {
      // @ts-expect-error - Testing with invalid page name
      expect(store.getPageDisplayName('UnknownPage')).toBe('UnknownPage')
    })
  })

  describe('getMostVisitedPage Computed', () => {
    it('should return null when no pages have been visited', () => {
      expect(store.getMostVisitedPage).toBeNull()
    })

    it('should return the most visited page', () => {
      store.trackPageVisit('SpellsView')
      store.trackPageVisit('HousesView')
      store.trackPageVisit('SpellsView')

      expect(store.getMostVisitedPage).toBe('SpellsView')
    })

    it('should handle ties by returning first found', () => {
      store.trackPageVisit('SpellsView')
      store.trackPageVisit('HousesView')

      // Should return one of them (implementation dependent)
      const mostVisited = store.getMostVisitedPage
      expect(['SpellsView', 'HousesView']).toContain(mostVisited)
    })
  })

  describe('getMostVisitedPageDisplayName Computed', () => {
    it('should return null when no pages have been visited', () => {
      expect(store.getMostVisitedPageDisplayName).toBeNull()
    })

    it('should return display name of most visited page', () => {
      store.trackPageVisit('SpellsView')
      store.trackPageVisit('HousesView')
      store.trackPageVisit('SpellsView')

      expect(store.getMostVisitedPageDisplayName).toBe('Spells & Enchantments')
    })

    it('should return updated display name', () => {
      store.trackPageVisit('SpellsView')
      store.updatePageDisplayName('SpellsView', 'Custom Spells')

      expect(store.getMostVisitedPageDisplayName).toBe('Custom Spells')
    })
  })

  describe('getVisitHistoryWithNames Computed', () => {
    it('should return empty array when no visits', () => {
      expect(store.getVisitHistoryWithNames).toEqual([])
    })

    it('should return visit history with display names', () => {
      store.trackPageVisit('SpellsView', 'Custom Spell Page')
      store.trackPageVisit('HousesView')

      const history = store.getVisitHistoryWithNames

      expect(history).toHaveLength(2)
      expect(history[0].displayName).toBe('Hogwarts Houses')
      expect(history[1].displayName).toBe('Custom Spell Page')
    })

    it('should use fallback names when displayName is missing', () => {
      // Manually add history entry without displayName
      store.tracker.visitHistory.push({
        page: 'SpellsView',
        displayName: '',
        timestamp: new Date().toISOString()
      })

      const history = store.getVisitHistoryWithNames

      expect(history[0].displayName).toBe('Spells & Enchantments')
    })
  })

  describe('DOM Manipulation Edge Cases', () => {
    it('should handle DOM manipulation when document.body is null', () => {
      // Mock document.body as null
      Object.defineProperty(document, 'body', {
        value: null,
        writable: true
      })

      // Should not throw error
      expect(() => {
        store.toggleDarkMode()
      }).not.toThrow()

      // Store state should still update
      expect(store.isDarkMode).toBe(true)
    })

    it('should handle DOM manipulation gracefully when classList is undefined', () => {
      // Mock document.body without classList
      Object.defineProperty(document, 'body', {
        value: {},
        writable: true
      })

      // Should not throw error
      expect(() => {
        store.toggleDarkMode()
      }).not.toThrow()

      // Store state should still update
      expect(store.isDarkMode).toBe(true)
    })

    it('should handle classList methods throwing errors gracefully', () => {
      const errorClassList = {
        add: vi.fn().mockImplementation(() => {
          throw new Error('DOM manipulation failed')
        }),
        remove: vi.fn().mockImplementation(() => {
          throw new Error('DOM manipulation failed')
        })
      }

      Object.defineProperty(document, 'body', {
        value: { classList: errorClassList },
        writable: true
      })

      // Should not throw error because of try-catch implementation
      expect(() => {
        store.toggleDarkMode()
      }).not.toThrow()

      // Store state should still update even if DOM manipulation fails
      expect(store.isDarkMode).toBe(true)
    })
  })

  describe('Realistic Usage Scenarios', () => {
    it('should simulate user browsing session with page tracking', () => {
      // User starts browsing
      expect(store.tracker.totalVisitCount).toBe(0)

      // User visits home page
      store.trackPageVisit('HomeView')
      expect(store.tracker.totalVisitCount).toBe(1)
      expect(store.tracker.lastVisitedPage).toBe('HomeView')

      // User toggles dark mode
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(true)

      // User views spells
      store.trackPageVisit('SpellsView')
      expect(store.tracker.totalVisitCount).toBe(2)
      expect(store.tracker.pageVisits.SpellsView).toBe(1)

      // User views specific spell
      store.trackPageVisit('SpellsDetailsView', 'Spell: Expelliarmus')
      expect(store.tracker.totalVisitCount).toBe(3)
      expect(store.tracker.lastViewedSpell).toBe('')

      // Update last viewed spell
      store.tracker.lastViewedSpell = 'spell-123'
      expect(store.tracker.lastViewedSpell).toBe('spell-123')

      // Final state verification
      expect(store.tracker.visitHistory).toHaveLength(3)
      expect(store.getMostVisitedPage).toBeTruthy()
    })

    it('should handle spell details tracking workflow', () => {
      // User visits spell details with dynamic name
      store.trackPageVisit('SpellsDetailsView', 'Spell: Wingardium Leviosa')

      // Update the spell ID they viewed
      store.tracker.lastViewedSpell = 'spell-wingardium-123'

      // Update the display name if spell loads more data
      store.updatePageDisplayName('SpellsDetailsView', 'Spell: Wingardium Leviosa (Advanced)')

      expect(store.tracker.lastViewedSpell).toBe('spell-wingardium-123')
      expect(store.tracker.lastVisitedPageDisplayName).toBe('Spell: Wingardium Leviosa (Advanced)')
      expect(store.getPageDisplayName('SpellsDetailsView')).toBe('Spell: Wingardium Leviosa (Advanced)')
    })

    it('should handle analytics data collection', () => {
      // Simulate user journey
      const pages = ['HomeView', 'SpellsView', 'SpellsDetailsView', 'HousesView', 'MyFavouritesView']

      pages.forEach((page, index) => {
        // @ts-expect-error - We know these are valid page names
        store.trackPageVisit(page)

        if (page === 'SpellsDetailsView') {
          store.tracker.lastViewedSpell = `spell-${index}`
        }
      })

      // Verify analytics data
      expect(store.tracker.totalVisitCount).toBe(5)
      expect(store.tracker.visitHistory).toHaveLength(5)
      expect(store.getMostVisitedPage).toBeTruthy()
      expect(store.getMostVisitedPageDisplayName).toBeTruthy()

      // Each page should have 1 visit
      pages.forEach(page => {
        // @ts-expect-error - We know these are valid page names
        expect(store.getPageVisitCount(page)).toBe(1)
      })
    })
  })

  describe('Type Safety and Edge Cases', () => {
    it('should handle all valid page names', () => {
      const validPages: Array<keyof typeof store.tracker.pageVisits> = [
        'ElixirView',
        'GamesView',
        'HomeView',
        'HousesView',
        'SpellsView',
        'MyFavouritesView',
        'SpellsDetailsView'
      ]

      validPages.forEach(page => {
        expect(() => store.trackPageVisit(page)).not.toThrow()
        expect(store.getPageVisitCount(page)).toBe(1)
        expect(store.getPageDisplayName(page)).toBeTruthy()
      })

      expect(store.tracker.totalVisitCount).toBe(validPages.length)
    })

    it('should handle rapid page visits', () => {
      // Simulate rapid navigation
      for (let i = 0; i < 50; i++) {
        store.trackPageVisit('SpellsView')
      }

      expect(store.tracker.totalVisitCount).toBe(50)
      expect(store.tracker.pageVisits.SpellsView).toBe(50)
      expect(store.tracker.visitHistory).toHaveLength(10) // Limited to 10
    })

    it('should maintain data integrity across operations', () => {
      // Complex sequence of operations
      store.trackPageVisit('SpellsView')
      store.toggleDarkMode()
      store.updatePageDisplayName('SpellsView', 'Custom Spells')
      store.trackPageVisit('HousesView')
      store.tracker.lastViewedSpell = 'spell-456'
      store.toggleDarkMode()

      // Verify all state is maintained correctly
      expect(store.isDarkMode).toBe(false)
      expect(store.tracker.totalVisitCount).toBe(2)
      expect(store.tracker.lastViewedSpell).toBe('spell-456')
      expect(store.getPageDisplayName('SpellsView')).toBe('Custom Spells')
      expect(store.tracker.lastVisitedPage).toBe('HousesView')
    })

    it('should handle visit history with different display names', () => {
      store.trackPageVisit('SpellsDetailsView', 'Spell: Expelliarmus')
      store.trackPageVisit('SpellsDetailsView', 'Spell: Stupefy')
      store.trackPageVisit('SpellsDetailsView', 'Spell: Protego')

      const history = store.getVisitHistoryWithNames

      expect(history).toHaveLength(3)
      expect(history[0].displayName).toBe('Spell: Protego')
      expect(history[1].displayName).toBe('Spell: Stupefy')
      expect(history[2].displayName).toBe('Spell: Expelliarmus')
    })
  })
})