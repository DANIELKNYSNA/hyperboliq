import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useElixirStore } from '../../../src/stores/elixirStore'
import { Difficulty, type ElixirInterface } from '../../../src/interfaces/elixirs'

// Mock the persistence plugin if needed
vi.mock('pinia-plugin-persistedstate', () => ({
  default: () => ({})
}))

describe('useElixirStore', () => {
  let store: ReturnType<typeof useElixirStore>

  const mockElixirs: ElixirInterface[] = [
    {
      id: '1',
      name: 'Felix Felicis',
      effect: 'Liquid luck that makes the drinker lucky for a period of time',
      sideEffects: 'Giddiness, recklessness, dangerous overconfidence',
      characteristics: 'Molten gold color',
      time: 'Six months to brew',
      difficulty: Difficulty.Advanced,
      ingredients: [
        {
          id: '1',
          name: 'Ashwinder egg'
        },
        {
          id: '2',
          name: 'Squill bulb'
        },
        {
          id: '3',
          name: 'Murtlap tentacle'
        }
      ],
      inventors: [{
        id: '1',
        firstName: 'Zygmunt',
        lastName: 'Budge'
      }],
      manufacturer: 'Various'
    },
    {
      id: '2',
      name: 'Polyjuice Potion',
      effect: 'Allows the drinker to assume the form of someone else',
      sideEffects: 'Nausea, pain during transformation',
      characteristics: 'Mudlike consistency, bubbling',
      time: 'One month to brew',
      difficulty: Difficulty.Advanced,
      ingredients: [
        {
          id: '1',
          name: 'Lacewing flies'
        },
        {
          id: '2',
          name: 'Leeches'
        },
        {
          id: '3',
          name: 'Powdered bicorn horn'
        }
      ],
      inventors: [{
        id: '1',
        firstName: 'Unknown',
        lastName: 'Inventor'
      }],
      manufacturer: 'Various'
    },
    {
      id: '3',
      name: 'Veritaserum',
      effect: 'Forces the drinker to tell the truth',
      sideEffects: 'None known',
      characteristics: 'Clear, water-like',
      time: 'One lunar month',
      difficulty: Difficulty.Advanced,
      ingredients: [{
        id: '1',
        name: 'Unknown'
      }],
      inventors: [
        {
          id: "some-id",
          firstName: "Inventor's First Name",
          lastName: "Inventor's Last Name"
        }
      ],
      manufacturer: 'Ministry of Magic'
    }
  ]

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useElixirStore()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.elixirs).toBeNull()
      expect(store.selectedElixir).toBeNull()
      expect(store.likedElixirs).toEqual([])
    })

    it('should be a Pinia store with correct store id', () => {
      expect(store.$id).toBe('elixirStore')
    })
  })

  describe('State Management', () => {
    it('should allow setting elixirs array', () => {
      store.elixirs = [...mockElixirs]

      expect(store.elixirs).toHaveLength(3)
      expect(store.elixirs?.[0].name).toBe('Felix Felicis')
      expect(store.elixirs?.[1].name).toBe('Polyjuice Potion')
      expect(store.elixirs?.[2].name).toBe('Veritaserum')
    })

    it('should allow setting selectedElixir', () => {
      store.selectedElixir = mockElixirs[0]

      expect(store.selectedElixir).toEqual(mockElixirs[0])
      expect(store.selectedElixir?.name).toBe('Felix Felicis')
    })

    it('should allow adding elixirs to likedElixirs', () => {
      store.likedElixirs = [mockElixirs[0], mockElixirs[2]]

      expect(store.likedElixirs).toHaveLength(2)
      expect(store.likedElixirs[0].name).toBe('Felix Felicis')
      expect(store.likedElixirs[1].name).toBe('Veritaserum')
    })

    it('should maintain reactivity when state changes', () => {
      // Set initial state
      store.elixirs = [...mockElixirs]
      expect(store.elixirs).toHaveLength(3)

      // Modify state
      store.elixirs = [mockElixirs[0]]
      expect(store.elixirs).toHaveLength(1)
      expect(store.elixirs[0].name).toBe('Felix Felicis')
    })
  })

  describe('deleteElixir Action', () => {
    beforeEach(() => {
      // Set up initial state for delete tests
      store.elixirs = [...mockElixirs]
      store.selectedElixir = mockElixirs[1] // Polyjuice Potion
      store.likedElixirs = [mockElixirs[0], mockElixirs[1]]
    })

    it('should delete elixir from elixirs array', () => {
      const initialCount = store.elixirs?.length || 0

      store.deleteElixir('1') // Delete Felix Felicis

      expect(store.elixirs).toHaveLength(initialCount - 1)
      expect(store.elixirs?.find(e => e.id === '1')).toBeUndefined()
      expect(store.elixirs?.find(e => e.id === '2')).toBeDefined()
      expect(store.elixirs?.find(e => e.id === '3')).toBeDefined()
    })

    it('should clear selectedElixir when deleting the selected elixir', () => {
      expect(store.selectedElixir?.id).toBe('2') // Polyjuice Potion is selected

      store.deleteElixir('2') // Delete the selected elixir

      expect(store.selectedElixir).toBeNull()
      expect(store.elixirs?.find(e => e.id === '2')).toBeUndefined()
    })

    it('should not clear selectedElixir when deleting a different elixir', () => {
      expect(store.selectedElixir?.id).toBe('2') // Polyjuice Potion is selected

      store.deleteElixir('1') // Delete Felix Felicis (different from selected)

      expect(store.selectedElixir?.id).toBe('2') // Should still be selected
      expect(store.selectedElixir?.name).toBe('Polyjuice Potion')
    })

    it('should handle deleting non-existent elixir gracefully', () => {
      const initialCount = store.elixirs?.length || 0

      store.deleteElixir('non-existent-id')

      expect(store.elixirs).toHaveLength(initialCount) // No change
      expect(store.selectedElixir?.id).toBe('2') // Selected elixir unchanged
    })

    it('should handle deletion when elixirs array is null', () => {
      store.elixirs = null

      // Should not throw error
      expect(() => {
        store.deleteElixir('1')
      }).not.toThrow()

      expect(store.elixirs).toBeNull()
    })

    it('should handle deletion when elixirs array is empty', () => {
      store.elixirs = []

      store.deleteElixir('1')

      expect(store.elixirs).toEqual([])
    })

    it('should delete all elixirs when called multiple times', () => {
      expect(store.elixirs).toHaveLength(3)

      store.deleteElixir('1')
      store.deleteElixir('2')
      store.deleteElixir('3')

      expect(store.elixirs).toHaveLength(0)
      expect(store.selectedElixir).toBeNull() // Was cleared when '2' was deleted
    })
  })

  describe('Edge Cases', () => {
    it('should handle setting elixirs to empty array', () => {
      store.elixirs = []

      expect(store.elixirs).toEqual([])
      expect(Array.isArray(store.elixirs)).toBe(true)
    })

    it('should handle setting elixirs back to null', () => {
      store.elixirs = [...mockElixirs]
      store.elixirs = null

      expect(store.elixirs).toBeNull()
    })

    it('should handle complex elixir data structures', () => {
      const complexElixir: ElixirInterface = {
        id: 'complex-1',
        name: 'Complex Elixir',
        effect: 'Multiple effects: healing and strength',
        sideEffects: 'Temporary blindness, nausea',
        characteristics: 'Swirling colors, sweet aroma',
        time: 'Variable: 1-6 months depending on moon phase',
        difficulty: Difficulty.Expert,
        ingredients: [
          { id: '1', name: 'Rare dragon blood' },
          { id: '2', name: 'phoenix feather' },
          { id: '3', name: 'unicorn hair' }
        ],
        inventors: [
          { id: '1', firstName: 'Ancient', lastName: 'Wizard' }
        ],
        manufacturer: 'Custom brew only'
      }

      store.elixirs = [complexElixir]
      store.selectedElixir = complexElixir

      expect(store.elixirs[0]).toEqual(complexElixir)
      expect(store.selectedElixir).toEqual(complexElixir)

      store.deleteElixir('complex-1')

      expect(store.elixirs).toHaveLength(0)
      expect(store.selectedElixir).toBeNull()
    })
  })

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // These tests ensure TypeScript compilation works correctly
      store.elixirs = mockElixirs
      store.selectedElixir = mockElixirs[0]
      store.likedElixirs = [mockElixirs[1]]

      // Access properties to ensure types are correct
      const elixirName: string = store.selectedElixir?.name || ''
      const elixirCount: number = store.elixirs?.length || 0
      const likedCount: number = store.likedElixirs.length

      expect(typeof elixirName).toBe('string')
      expect(typeof elixirCount).toBe('number')
      expect(typeof likedCount).toBe('number')
    })

    it('should handle nullable types correctly', () => {
      // Test null states
      store.elixirs = null
      store.selectedElixir = null

      expect(store.elixirs).toBeNull()
      expect(store.selectedElixir).toBeNull()

      // Ensure likedElixirs is always an array (not nullable)
      expect(Array.isArray(store.likedElixirs)).toBe(true)
    })
  })
})
