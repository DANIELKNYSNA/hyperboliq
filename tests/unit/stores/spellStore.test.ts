// tests/unit/stores/spellStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSpellStore } from '../../../src/stores/spellStore'
import type { SpellInterface } from '../../../src/interfaces/spell'

// Mock the persistence plugin if needed
vi.mock('pinia-plugin-persistedstate', () => ({
  default: () => ({})
}))

describe('useSpellStore', () => {
  let store: ReturnType<typeof useSpellStore>

  const mockSpells: SpellInterface[] = [
    {
      id: '1',
      name: 'Expelliarmus',
      incantation: 'Expelliarmus',
      effect: 'Disarms the target, causing them to release whatever they are holding',
      canBeVerbal: true,
      type: 'Charm',
      light: 'Scarlet',
      creator: 'Unknown'
    },
    {
      id: '2',
      name: 'Stupefy',
      incantation: 'Stupefy',
      effect: 'Stuns the target, rendering them unconscious',
      canBeVerbal: true,
      type: 'Jinx',
      light: 'Red',
      creator: 'Unknown'
    },
    {
      id: '3',
      name: 'Expecto Patronum',
      incantation: 'Expecto Patronum',
      effect: 'Conjures a Patronus to repel Dementors and Lethifolds',
      canBeVerbal: true,
      type: 'Charm',
      light: 'Silver-White',
      creator: 'Ancient Magic'
    },
    {
      id: '4',
      name: 'Avada Kedavra',
      incantation: 'Avada Kedavra',
      effect: 'Causes instant death to the victim',
      canBeVerbal: true,
      type: 'Curse',
      light: 'Green',
      creator: 'Unknown Dark Wizard'
    },
    {
      id: '5',
      name: 'Alohomora',
      incantation: 'Alohomora',
      effect: 'Unlocks doors and windows',
      canBeVerbal: true,
      type: 'Charm',
      light: 'None',
      creator: 'Eldon Elsrickle'
    },
    {
      name: 'Protean Charm',
      incantation: 'Protean',
      effect: 'Links objects so that changes to one affect all others',
      canBeVerbal: false,
      type: 'Charm',
      light: 'None',
      creator: 'Hermione Granger'
    }
  ]

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useSpellStore()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.spells).toBeNull()
      expect(store.selectedSpell).toBeNull()
      expect(store.likedSpells).toEqual([])
    })

    it('should be a Pinia store with correct store id', () => {
      expect(store.$id).toBe('spellStore')
    })

    it('should have all expected state properties and actions', () => {
      expect(store).toHaveProperty('spells')
      expect(store).toHaveProperty('selectedSpell')
      expect(store).toHaveProperty('likedSpells')
      expect(store).toHaveProperty('deleteSpell')
      expect(typeof store.deleteSpell).toBe('function')
    })
  })

  describe('Spells State Management', () => {
    it('should allow setting spells array', () => {
      store.spells = [...mockSpells]

      expect(store.spells).toHaveLength(6)
      expect(store.spells?.[0].name).toBe('Expelliarmus')
      expect(store.spells?.[1].name).toBe('Stupefy')
      expect(store.spells?.[2].name).toBe('Expecto Patronum')
      expect(store.spells?.[3].name).toBe('Avada Kedavra')
      expect(store.spells?.[4].name).toBe('Alohomora')
      expect(store.spells?.[5].name).toBe('Protean Charm')
    })

    it('should allow setting spells to null', () => {
      store.spells = [...mockSpells]
      expect(store.spells).toHaveLength(6)

      store.spells = null
      expect(store.spells).toBeNull()
    })

    it('should allow setting spells to empty array', () => {
      store.spells = []

      expect(store.spells).toEqual([])
      expect(Array.isArray(store.spells)).toBe(true)
      expect(store.spells).toHaveLength(0)
    })

    it('should maintain reactivity when spells change', () => {
      // Set initial spells
      store.spells = [...mockSpells]
      expect(store.spells).toHaveLength(6)

      // Update to subset
      store.spells = [mockSpells[0], mockSpells[2]]
      expect(store.spells).toHaveLength(2)
      expect(store.spells[0].name).toBe('Expelliarmus')
      expect(store.spells[1].name).toBe('Expecto Patronum')
    })

    it('should handle spells with different properties', () => {
      store.spells = [...mockSpells]

      const verbalSpells = store.spells?.filter(spell => spell.canBeVerbal)
      const nonVerbalSpells = store.spells?.filter(spell => !spell.canBeVerbal)
      const charmSpells = store.spells?.filter(spell => spell.type === 'Charm')
      const lightSpells = store.spells?.filter(spell => spell.light !== 'None')

      expect(verbalSpells).toHaveLength(5)
      expect(nonVerbalSpells).toHaveLength(1)
      expect(charmSpells).toHaveLength(4) // Expelliarmus, Expecto Patronum, Alohomora, Protean Charm
      expect(lightSpells).toHaveLength(4) // All except Alohomora and Protean Charm
    })

    it('should handle spells with and without IDs', () => {
      store.spells = [...mockSpells]

      const spellsWithId = store.spells?.filter(spell => spell.id)
      const spellsWithoutId = store.spells?.filter(spell => !spell.id)

      expect(spellsWithId).toHaveLength(5)
      expect(spellsWithoutId).toHaveLength(1) // Protean Charm has no ID
      expect(spellsWithoutId?.[0].name).toBe('Protean Charm')
    })
  })

  describe('SelectedSpell State Management', () => {
    it('should allow setting selectedSpell', () => {
      store.selectedSpell = mockSpells[0] // Expelliarmus

      expect(store.selectedSpell).toEqual(mockSpells[0])
      expect(store.selectedSpell?.name).toBe('Expelliarmus')
      expect(store.selectedSpell?.type).toBe('Charm')
      expect(store.selectedSpell?.canBeVerbal).toBe(true)
      expect(store.selectedSpell?.light).toBe('Scarlet')
      expect(store.selectedSpell?.creator).toBe('Unknown')
    })

    it('should allow changing selectedSpell', () => {
      // Set initial selection
      store.selectedSpell = mockSpells[0] // Expelliarmus
      expect(store.selectedSpell?.name).toBe('Expelliarmus')

      // Change selection
      store.selectedSpell = mockSpells[2] // Expecto Patronum
      expect(store.selectedSpell?.name).toBe('Expecto Patronum')
      expect(store.selectedSpell?.effect).toContain('Patronus')
      expect(store.selectedSpell?.light).toBe('Silver-White')
    })

    it('should allow setting selectedSpell to null', () => {
      store.selectedSpell = mockSpells[1] // Stupefy
      expect(store.selectedSpell?.name).toBe('Stupefy')

      store.selectedSpell = null
      expect(store.selectedSpell).toBeNull()
    })

    it('should maintain full spell data when selected', () => {
      const selectedSpell = mockSpells[3] // Avada Kedavra
      store.selectedSpell = selectedSpell

      expect(store.selectedSpell?.id).toBe('4')
      expect(store.selectedSpell?.name).toBe('Avada Kedavra')
      expect(store.selectedSpell?.incantation).toBe('Avada Kedavra')
      expect(store.selectedSpell?.effect).toBe('Causes instant death to the victim')
      expect(store.selectedSpell?.canBeVerbal).toBe(true)
      expect(store.selectedSpell?.type).toBe('Curse')
      expect(store.selectedSpell?.light).toBe('Green')
      expect(store.selectedSpell?.creator).toBe('Unknown Dark Wizard')
    })

    it('should handle selecting spells without IDs', () => {
      const spellWithoutId = mockSpells[5] // Protean Charm
      store.selectedSpell = spellWithoutId

      expect(store.selectedSpell?.name).toBe('Protean Charm')
      expect(store.selectedSpell?.canBeVerbal).toBe(false)
      expect(store.selectedSpell?.creator).toBe('Hermione Granger')
      expect(store.selectedSpell?.id).toBeUndefined()
    })
  })

  describe('LikedSpells State Management', () => {
    it('should allow adding spells to likedSpells', () => {
      store.likedSpells = [mockSpells[0], mockSpells[2]]

      expect(store.likedSpells).toHaveLength(2)
      expect(store.likedSpells[0].name).toBe('Expelliarmus')
      expect(store.likedSpells[1].name).toBe('Expecto Patronum')
    })

    it('should allow setting likedSpells to empty array', () => {
      store.likedSpells = [mockSpells[0], mockSpells[1]]
      expect(store.likedSpells).toHaveLength(2)

      store.likedSpells = []
      expect(store.likedSpells).toEqual([])
      expect(store.likedSpells).toHaveLength(0)
    })

    it('should allow multiple spells in likedSpells', () => {
      store.likedSpells = [...mockSpells]

      expect(store.likedSpells).toHaveLength(6)
      expect(store.likedSpells.map(s => s.name)).toContain('Expelliarmus')
      expect(store.likedSpells.map(s => s.name)).toContain('Stupefy')
      expect(store.likedSpells.map(s => s.name)).toContain('Expecto Patronum')
      expect(store.likedSpells.map(s => s.name)).toContain('Protean Charm')
    })

    it('should handle spells with different properties in likedSpells', () => {
      const diverseLikedSpells = [
        mockSpells[0], // Verbal charm with light
        mockSpells[5], // Non-verbal charm without ID
        mockSpells[3]  // Verbal curse
      ]
      store.likedSpells = diverseLikedSpells

      expect(store.likedSpells).toHaveLength(3)
      expect(store.likedSpells.some(s => s.canBeVerbal === false)).toBe(true)
      expect(store.likedSpells.some(s => s.type === 'Curse')).toBe(true)
      expect(store.likedSpells.some(s => !s.id)).toBe(true)
    })

    it('should maintain array type even when empty', () => {
      expect(Array.isArray(store.likedSpells)).toBe(true)
      expect(store.likedSpells).toHaveLength(0)

      store.likedSpells = [mockSpells[0]]
      store.likedSpells = []

      expect(Array.isArray(store.likedSpells)).toBe(true)
      expect(store.likedSpells).toHaveLength(0)
    })
  })

  describe('deleteSpell Action', () => {
    beforeEach(() => {
      // Set up initial state for delete tests
      store.spells = [...mockSpells]
      store.selectedSpell = mockSpells[1] // Stupefy
      store.likedSpells = [mockSpells[0], mockSpells[1], mockSpells[2]]
    })

    it('should delete spell from spells array by ID', () => {
      const initialCount = store.spells?.length || 0

      store.deleteSpell('1') // Delete Expelliarmus

      expect(store.spells).toHaveLength(initialCount - 1)
      expect(store.spells?.find(s => s.id === '1')).toBeUndefined()
      expect(store.spells?.find(s => s.id === '2')).toBeDefined() // Stupefy still exists
      expect(store.spells?.find(s => s.id === '3')).toBeDefined() // Expecto Patronum still exists
    })

    it('should clear selectedSpell when deleting the selected spell', () => {
      expect(store.selectedSpell?.id).toBe('2') // Stupefy is selected

      store.deleteSpell('2') // Delete the selected spell

      expect(store.selectedSpell).toBeNull()
      expect(store.spells?.find(s => s.id === '2')).toBeUndefined()
    })

    it('should not clear selectedSpell when deleting a different spell', () => {
      expect(store.selectedSpell?.id).toBe('2') // Stupefy is selected

      store.deleteSpell('1') // Delete Expelliarmus (different from selected)

      expect(store.selectedSpell?.id).toBe('2') // Should still be selected
      expect(store.selectedSpell?.name).toBe('Stupefy')
    })

    it('should handle deleting non-existent spell gracefully', () => {
      const initialCount = store.spells?.length || 0

      store.deleteSpell('non-existent-id')

      expect(store.spells).toHaveLength(initialCount) // No change
      expect(store.selectedSpell?.id).toBe('2') // Selected spell unchanged
    })

    it('should not delete spells without IDs when trying to delete by ID', () => {
      const initialCount = store.spells?.length || 0
      const proteanCharm = store.spells?.find(s => s.name === 'Protean Charm')

      expect(proteanCharm).toBeDefined()
      expect(proteanCharm?.id).toBeUndefined()

      // Try to delete by some ID - shouldn't affect spells without IDs
      store.deleteSpell('protean-charm-id')

      expect(store.spells).toHaveLength(initialCount) // No change
      expect(store.spells?.find(s => s.name === 'Protean Charm')).toBeDefined()
    })

    it('should handle deletion when spells array is null', () => {
      store.spells = null

      // Should not throw error
      expect(() => {
        store.deleteSpell('1')
      }).not.toThrow()

      expect(store.spells).toBeNull()
      expect(store.selectedSpell?.id).toBe('2') // Selected spell should be unchanged
    })

    it('should handle deletion when spells array is empty', () => {
      store.spells = []

      store.deleteSpell('1')

      expect(store.spells).toEqual([])
      expect(store.selectedSpell?.id).toBe('2') // Selected spell unchanged
    })

    it('should delete multiple spells when called multiple times', () => {
      expect(store.spells).toHaveLength(6)

      store.deleteSpell('1') // Expelliarmus
      store.deleteSpell('3') // Expecto Patronum
      store.deleteSpell('5') // Alohomora

      expect(store.spells).toHaveLength(3)
      expect(store.spells?.map(s => s.name)).toEqual(['Stupefy', 'Avada Kedavra', 'Protean Charm'])
    })

    it('should delete all spells with IDs when called for each spell ID', () => {
      expect(store.spells).toHaveLength(6)

      // Delete all spells with IDs
      const items = ['1', '2', '3', '4', '5']
      items.forEach(id => store.deleteSpell(id))

      expect(store.spells).toHaveLength(1) // Only Protean Charm should remain (no ID)
      expect(store.spells?.[0].name).toBe('Protean Charm')
      expect(store.selectedSpell).toBeNull() // Was cleared when '2' was deleted
    })

    it('should handle deletion with complex spell data', () => {
      const complexSpell: SpellInterface = {
        id: 'complex-1',
        name: 'Extremely Complex Spell with Long Name',
        incantation: 'Complexus Maximus Spellicus Extraordinarius',
        effect: 'This spell has a very complex effect that does multiple things including but not limited to transformation, healing, protection, and temporal manipulation',
        canBeVerbal: false,
        type: 'Advanced Experimental Charm',
        light: 'Prismatic Rainbow',
        creator: 'Professor Albus Dumbledore'
      }

      // Add complex spell to the store
      store.spells = [...mockSpells, complexSpell]
      store.selectedSpell = complexSpell

      expect(store.spells).toHaveLength(7)
      expect(store.selectedSpell?.name).toContain('Complex')
      expect(store.selectedSpell?.canBeVerbal).toBe(false)
      expect(store.selectedSpell?.light).toBe('Prismatic Rainbow')

      store.deleteSpell('complex-1')

      expect(store.spells).toHaveLength(6)
      expect(store.selectedSpell).toBeNull()
      expect(store.spells?.find(s => s.id === 'complex-1')).toBeUndefined()
    })
  })

  describe('Multiple State Interactions', () => {
    it('should allow setting all states independently', () => {
      store.spells = [...mockSpells]
      store.selectedSpell = mockSpells[0] // Expelliarmus
      store.likedSpells = [mockSpells[1], mockSpells[2]] // Stupefy, Expecto Patronum

      expect(store.spells).toHaveLength(6)
      expect(store.selectedSpell?.name).toBe('Expelliarmus')
      expect(store.likedSpells).toHaveLength(2)
      expect(store.likedSpells.map(s => s.name)).toContain('Stupefy')
    })

    it('should handle selectedSpell being in likedSpells', () => {
      const favoriteSpell = mockSpells[2] // Expecto Patronum
      store.selectedSpell = favoriteSpell
      store.likedSpells = [mockSpells[0], favoriteSpell, mockSpells[4]]

      expect(store.selectedSpell?.name).toBe('Expecto Patronum')
      expect(store.likedSpells.some(s => s.name === favoriteSpell.name)).toBe(true)
      expect(store.likedSpells).toHaveLength(3)
    })

    it('should handle mixing spells with and without IDs', () => {
      store.selectedSpell = mockSpells[5] // Protean Charm (no ID)
      store.likedSpells = [mockSpells[0], mockSpells[5]] // Mix of with/without ID

      expect(store.selectedSpell?.id).toBeUndefined()
      expect(store.selectedSpell?.name).toBe('Protean Charm')
      expect(store.likedSpells.some(s => s.id)).toBe(true)
      expect(store.likedSpells.some(s => !s.id)).toBe(true)
    })

    it('should handle deletion affecting likedSpells (manual cleanup needed)', () => {
      store.spells = [...mockSpells]
      store.likedSpells = [mockSpells[0], mockSpells[1], mockSpells[2]]

      // Delete a spell that's in likedSpells
      store.deleteSpell('1') // Delete Expelliarmus

      // Note: The current implementation doesn't automatically clean up likedSpells
      // This test documents the current behavior
      expect(store.spells?.find(s => s.id === '1')).toBeUndefined()
      expect(store.likedSpells.find(s => s.id === '1')).toBeDefined() // Still in liked

      // In a real app, you might want to clean up likedSpells too
    })
  })

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // Set state to ensure types work
      store.spells = mockSpells
      store.selectedSpell = mockSpells[0]
      store.likedSpells = [mockSpells[1]]

      // Access properties to ensure types are correct
      const spellsCount: number = store.spells?.length || 0
      const selectedSpellName: string = store.selectedSpell?.name || ''
      const selectedSpellType: string = store.selectedSpell?.type || ''
      const selectedCanBeVerbal: boolean = store.selectedSpell?.canBeVerbal || false
      const selectedLight: string = store.selectedSpell?.light || ''
      const selectedCreator: string = store.selectedSpell?.creator || ''
      const likedCount: number = store.likedSpells.length
      const firstLikedIncantation: string = store.likedSpells[0]?.incantation || ''

      expect(typeof spellsCount).toBe('number')
      expect(typeof selectedSpellName).toBe('string')
      expect(typeof selectedSpellType).toBe('string')
      expect(typeof selectedCanBeVerbal).toBe('boolean')
      expect(typeof selectedLight).toBe('string')
      expect(typeof selectedCreator).toBe('string')
      expect(typeof likedCount).toBe('number')
      expect(typeof firstLikedIncantation).toBe('string')
    })

    it('should handle nullable types correctly', () => {
      // Test null states
      store.spells = null
      store.selectedSpell = null

      expect(store.spells).toBeNull()
      expect(store.selectedSpell).toBeNull()

      // Ensure likedSpells is always an array (not nullable)
      expect(Array.isArray(store.likedSpells)).toBe(true)

      // Should not throw when accessing properties of null values
      expect(store.spells?.length).toBeUndefined()
      expect(store.selectedSpell?.name).toBeUndefined()
      expect(store.selectedSpell?.canBeVerbal).toBeUndefined()
    })

    it('should handle optional ID property correctly', () => {
      const spellWithId = mockSpells[0]
      const spellWithoutId = mockSpells[5]

      store.selectedSpell = spellWithId
      expect(store.selectedSpell?.id).toBe('1')

      store.selectedSpell = spellWithoutId
      expect(store.selectedSpell?.id).toBeUndefined()
    })

    it('should properly type action parameters', () => {
      // This test ensures deleteSpell accepts string parameter
      const spellId: string = '1'

      expect(() => {
        store.deleteSpell(spellId)
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle spells with minimal data', () => {
      const minimalSpell: SpellInterface = {
        name: 'Basic Spell',
        incantation: 'Basicius',
        effect: 'Does something basic',
        canBeVerbal: true,
        type: 'Unknown',
        light: 'None',
        creator: 'Unknown'
      }

      store.selectedSpell = minimalSpell
      store.likedSpells = [minimalSpell]

      expect(store.selectedSpell.name).toBe('Basic Spell')
      expect(store.selectedSpell.id).toBeUndefined()
      expect(store.likedSpells[0].effect).toBe('Does something basic')
    })

    it('should handle spells with empty strings', () => {
      const emptyFieldSpell: SpellInterface = {
        id: 'empty',
        name: '',
        incantation: '',
        effect: '',
        canBeVerbal: false,
        type: '',
        light: '',
        creator: ''
      }

      store.spells = [emptyFieldSpell]
      store.selectedSpell = emptyFieldSpell

      expect(store.spells[0].name).toBe('')
      expect(store.selectedSpell?.effect).toBe('')
      expect(store.selectedSpell?.canBeVerbal).toBe(false)
    })

    it('should handle boolean edge cases', () => {
      const verbalSpell: SpellInterface = {
        id: 'verbal',
        name: 'Verbal Spell',
        incantation: 'Speakicus',
        effect: 'Requires speech',
        canBeVerbal: true,
        type: 'Charm',
        light: 'Blue',
        creator: 'Test Creator'
      }

      const nonVerbalSpell: SpellInterface = {
        id: 'nonverbal',
        name: 'Silent Spell',
        incantation: 'Silentius',
        effect: 'Can be cast silently',
        canBeVerbal: false,
        type: 'Charm',
        light: 'None',
        creator: 'Advanced Wizard'
      }

      store.likedSpells = [verbalSpell, nonVerbalSpell]

      expect(store.likedSpells[0].canBeVerbal).toBe(true)
      expect(store.likedSpells[1].canBeVerbal).toBe(false)
    })

    it('should handle rapid state changes', () => {
      // Rapid changes to test reactivity
      mockSpells.forEach((spell) => {
        store.selectedSpell = spell
        expect(store.selectedSpell?.name).toBe(spell.name)
      })

      // Rapid deletions
      store.spells = [...mockSpells]
      store.deleteSpell('1')
      store.deleteSpell('2')
      store.deleteSpell('3')

      expect(store.spells).toHaveLength(3) // 2 deleted, Protean Charm has no ID
    })
  })
})