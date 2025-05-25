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
        visitCount: 0,
        lastViewedSpell: ''
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

      // Actions
      expect(store).toHaveProperty('toggleDarkMode')
      expect(typeof store.toggleDarkMode).toBe('function')
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
    it('should allow updating visitCount', () => {
      store.tracker.visitCount = 5
      expect(store.tracker.visitCount).toBe(5)
    })

    it('should allow updating lastViewedSpell', () => {
      store.tracker.lastViewedSpell = 'Expelliarmus'
      expect(store.tracker.lastViewedSpell).toBe('Expelliarmus')
    })

    it('should allow updating both tracker properties', () => {
      store.tracker = {
        visitCount: 10,
        lastViewedSpell: 'Stupefy'
      }

      expect(store.tracker.visitCount).toBe(10)
      expect(store.tracker.lastViewedSpell).toBe('Stupefy')
    })

    it('should allow incremental updates to visitCount', () => {
      expect(store.tracker.visitCount).toBe(0)

      store.tracker.visitCount++
      expect(store.tracker.visitCount).toBe(1)

      store.tracker.visitCount += 5
      expect(store.tracker.visitCount).toBe(6)
    })

    it('should handle large visit counts', () => {
      store.tracker.visitCount = 999999
      expect(store.tracker.visitCount).toBe(999999)
    })

    it('should handle long spell names', () => {
      const longSpellName = 'Extremely Long Spell Name That Exceeds Normal Length Limits'
      store.tracker.lastViewedSpell = longSpellName
      expect(store.tracker.lastViewedSpell).toBe(longSpellName)
    })

    it('should maintain object structure when updating individual properties', () => {
      store.tracker.visitCount = 5
      expect(store.tracker.lastViewedSpell).toBe('') // Should remain unchanged

      store.tracker.lastViewedSpell = 'Alohomora'
      expect(store.tracker.visitCount).toBe(5) // Should remain unchanged
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
      store.tracker = {
        visitCount: 5,
        lastViewedSpell: 'Expelliarmus'
      }

      store.toggleDarkMode()

      expect(store.tracker.visitCount).toBe(5)
      expect(store.tracker.lastViewedSpell).toBe('Expelliarmus')
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

      // Should not throw error with defensive implementation
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

  describe('State Interactions', () => {
    it('should allow independent state management', () => {
      // Set tracker data
      store.tracker = {
        visitCount: 25,
        lastViewedSpell: 'Patronus Charm'
      }

      // Toggle dark mode
      store.toggleDarkMode()

      // Both states should be independent
      expect(store.isDarkMode).toBe(true)
      expect(store.themeClass).toBe('dark')
      expect(store.tracker.visitCount).toBe(25)
      expect(store.tracker.lastViewedSpell).toBe('Patronus Charm')
    })

    it('should handle rapid state changes', () => {
      // Rapid tracker updates
      for (let i = 0; i < 10; i++) {
        store.tracker.visitCount = i
        store.tracker.lastViewedSpell = `Spell ${i}`
      }

      expect(store.tracker.visitCount).toBe(9)
      expect(store.tracker.lastViewedSpell).toBe('Spell 9')

      // Rapid dark mode toggles
      for (let i = 0; i < 5; i++) {
        store.toggleDarkMode()
      }

      expect(store.isDarkMode).toBe(true) // Odd number of toggles
      expect(store.themeClass).toBe('dark')
    })
  })

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // Set state to ensure types work
      store.isDarkMode = true
      store.tracker = {
        visitCount: 15,
        lastViewedSpell: 'Lumos'
      }

      // Access properties to ensure types are correct
      const darkModeStatus: boolean = store.isDarkMode
      const visitCount: number = store.tracker.visitCount
      const lastSpell: string = store.tracker.lastViewedSpell
      const themeClassName: string = store.themeClass

      expect(typeof darkModeStatus).toBe('boolean')
      expect(typeof visitCount).toBe('number')
      expect(typeof lastSpell).toBe('string')
      expect(typeof themeClassName).toBe('string')
    })

    it('should handle boolean type correctly', () => {
      // Test explicit boolean values
      store.isDarkMode = true
      expect(store.isDarkMode).toBe(true)
      expect(typeof store.isDarkMode).toBe('boolean')

      store.isDarkMode = false
      expect(store.isDarkMode).toBe(false)
      expect(typeof store.isDarkMode).toBe('boolean')
    })

    it('should handle tracker object type correctly', () => {
      const trackerData = {
        visitCount: 33,
        lastViewedSpell: 'Wingardium Leviosa'
      }

      store.tracker = trackerData

      expect(store.tracker).toEqual(trackerData)
      expect(typeof store.tracker.visitCount).toBe('number')
      expect(typeof store.tracker.lastViewedSpell).toBe('string')
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative visit counts', () => {
      store.tracker.visitCount = -5
      expect(store.tracker.visitCount).toBe(-5)
    })

    it('should handle zero visit count', () => {
      store.tracker.visitCount = 10
      store.tracker.visitCount = 0
      expect(store.tracker.visitCount).toBe(0)
    })

    it('should handle empty string for lastViewedSpell', () => {
      store.tracker.lastViewedSpell = 'Alohomora'
      store.tracker.lastViewedSpell = ''
      expect(store.tracker.lastViewedSpell).toBe('')
    })

    it('should handle special characters in lastViewedSpell', () => {
      const specialSpellName = 'Spell with éspecial çharacters & symbols!'
      store.tracker.lastViewedSpell = specialSpellName
      expect(store.tracker.lastViewedSpell).toBe(specialSpellName)
    })

    it('should handle very large visit counts', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER
      store.tracker.visitCount = largeNumber
      expect(store.tracker.visitCount).toBe(largeNumber)
    })

    it('should handle decimal visit counts (if somehow set)', () => {
      store.tracker.visitCount = 5.5
      expect(store.tracker.visitCount).toBe(5.5)
    })

    it('should handle unicode characters in spell names', () => {
      const unicodeSpellName = '魔法咒语 ✨🧙‍♂️'
      store.tracker.lastViewedSpell = unicodeSpellName
      expect(store.tracker.lastViewedSpell).toBe(unicodeSpellName)
    })
  })

  describe('Realistic Usage Scenarios', () => {
    it('should simulate user browsing session', () => {
      // User starts browsing
      expect(store.tracker.visitCount).toBe(0)
      expect(store.tracker.lastViewedSpell).toBe('')

      // User views first spell
      store.tracker.visitCount++
      store.tracker.lastViewedSpell = 'Lumos'

      expect(store.tracker.visitCount).toBe(1)
      expect(store.tracker.lastViewedSpell).toBe('Lumos')

      // User toggles dark mode
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(true)
      expect(store.themeClass).toBe('dark')

      // User continues browsing
      store.tracker.visitCount++
      store.tracker.lastViewedSpell = 'Nox'

      expect(store.tracker.visitCount).toBe(2)
      expect(store.tracker.lastViewedSpell).toBe('Nox')

      // User toggles dark mode back
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(false)
      expect(store.themeClass).toBe('')

      // Final state
      expect(store.tracker.visitCount).toBe(2)
      expect(store.tracker.lastViewedSpell).toBe('Nox')
    })

    it('should handle theme preference persistence simulation', () => {
      // User enables dark mode
      store.toggleDarkMode()
      expect(store.isDarkMode).toBe(true)
      expect(mockClassList.add).toHaveBeenCalledWith('dark')

      // Simulate app restart (store should persist the preference)
      expect(store.isDarkMode).toBe(true)
      expect(store.themeClass).toBe('dark')
    })

    it('should handle tracking user engagement', () => {
      const spellSequence = [
        'Expelliarmus',
        'Stupefy',
        'Expecto Patronum',
        'Alohomora',
        'Wingardium Leviosa'
      ]

      spellSequence.forEach((spell, index) => {
        store.tracker.visitCount = index + 1
        store.tracker.lastViewedSpell = spell
      })

      expect(store.tracker.visitCount).toBe(5)
      expect(store.tracker.lastViewedSpell).toBe('Wingardium Leviosa')
    })
  })
})