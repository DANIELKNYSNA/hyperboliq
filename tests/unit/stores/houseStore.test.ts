// tests/unit/stores/houseStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHouseStore } from '../../../src/stores/houseStore'
import type { HouseInterface } from '../../../src/interfaces/house'

// Mock the persistence plugin if needed
vi.mock('pinia-plugin-persistedstate', () => ({
  default: () => ({})
}))

describe('useHouseStore', () => {
  let store: ReturnType<typeof useHouseStore>

  const mockHouses: HouseInterface[] = [
    {
      id: '1',
      name: 'Gryffindor',
      houseColours: 'Scarlet and gold',
      founder: 'Godric Gryffindor',
      animal: 'Lion',
      element: 'Fire',
      ghost: 'Nearly Headless Nick',
      commonRoom: 'Gryffindor Tower',
      heads: [
        {
          id: '1',
          firstName: 'Minerva',
          lastName: 'McGonagall'
        }
      ],
      traits: [
        {
          id: '1',
          name: 'Courage'
        },
        {
          id: '2',
          name: 'Bravery'
        },
        {
          id: '3',
          name: 'Nerve'
        },
        {
          id: '4',
          name: 'Chivalry'
        }
      ]
    },
    {
      id: '2',
      name: 'Hufflepuff',
      houseColours: 'Yellow and black',
      founder: 'Helga Hufflepuff',
      animal: 'Badger',
      element: 'Earth',
      ghost: 'Fat Friar',
      commonRoom: 'Hufflepuff Basement',
      heads: [
        {
          id: '2',
          firstName: 'Pomona',
          lastName: 'Sprout'
        }
      ],
      traits: [
        {
          id: '5',
          name: 'Hard work'
        },
        {
          id: '6',
          name: 'Patience'
        },
        {
          id: '7',
          name: 'Loyalty'
        },
        {
          id: '8',
          name: 'Fair play'
        }
      ]
    },
    {
      id: '3',
      name: 'Ravenclaw',
      houseColours: 'Blue and silver',
      founder: 'Rowena Ravenclaw',
      animal: 'Eagle',
      element: 'Air',
      ghost: 'Grey Lady',
      commonRoom: 'Ravenclaw Tower',
      heads: [
        {
          id: '3',
          firstName: 'Filius',
          lastName: 'Flitwick'
        }
      ],
      traits: [
        {
          id: '9',
          name: 'Intelligence'
        },
        {
          id: '10',
          name: 'Learning'
        },
        {
          id: '11',
          name: 'Wisdom'
        },
        {
          id: '12',
          name: 'Wit'
        }
      ]
    },
    {
      id: '4',
      name: 'Slytherin',
      houseColours: 'Green and silver',
      founder: 'Salazar Slytherin',
      animal: 'Serpent',
      element: 'Water',
      ghost: 'Bloody Baron',
      commonRoom: 'Slytherin Dungeon',
      heads: [
        {
          id: '4',
          firstName: 'Severus',
          lastName: 'Snape'
        }
      ],
      traits: [
        {
          id: '13',
          name: 'Ambition'
        },
        {
          id: '14',
          name: 'Cunning'
        },
        {
          id: '15',
          name: 'Leadership'
        },
        {
          id: '16',
          name: 'Resourcefulness'
        }
      ]
    }
  ]

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useHouseStore()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.houses).toBeNull()
      expect(store.userSelectedHouse).toBeNull()
      expect(store.myHouse).toBeNull()
    })

    it('should be a Pinia store with correct store id', () => {
      expect(store.$id).toBe('houseStore')
    })

    it('should have all expected state properties', () => {
      expect(store).toHaveProperty('houses')
      expect(store).toHaveProperty('userSelectedHouse')
      expect(store).toHaveProperty('myHouse')
    })
  })

  describe('Houses State Management', () => {
    it('should allow setting houses array', () => {
      store.houses = [...mockHouses]

      expect(store.houses).toHaveLength(4)
      expect(store.houses?.[0].name).toBe('Gryffindor')
      expect(store.houses?.[1].name).toBe('Hufflepuff')
      expect(store.houses?.[2].name).toBe('Ravenclaw')
      expect(store.houses?.[3].name).toBe('Slytherin')
    })

    it('should allow setting houses to null', () => {
      store.houses = [...mockHouses]
      expect(store.houses).toHaveLength(4)

      store.houses = null
      expect(store.houses).toBeNull()
    })

    it('should allow setting houses to empty array', () => {
      store.houses = []

      expect(store.houses).toEqual([])
      expect(Array.isArray(store.houses)).toBe(true)
      expect(store.houses).toHaveLength(0)
    })

    it('should maintain reactivity when houses change', () => {
      // Set initial houses
      store.houses = [...mockHouses]
      expect(store.houses).toHaveLength(4)

      // Update to subset
      store.houses = [mockHouses[0], mockHouses[1]]
      expect(store.houses).toHaveLength(2)
      expect(store.houses[0].name).toBe('Gryffindor')
      expect(store.houses[1].name).toBe('Hufflepuff')
    })

    it('should handle complex house data structures', () => {
      const complexHouse: HouseInterface = {
        id: 'test-house',
        name: 'Test House',
        houseColours: 'Purple and orange',
        founder: 'Test Founder',
        animal: 'Phoenix',
        element: 'Spirit',
        ghost: 'Test Ghost',
        commonRoom: 'Test Common Room',
        heads: [
          { id: 'head1', firstName: 'John', lastName: 'Doe' },
          { id: 'head2', firstName: 'Jane', lastName: 'Smith' }
        ],
        traits: [
          { id: 'trait1', name: 'Creativity' },
          { id: 'trait2', name: 'Innovation' },
          { id: 'trait3', name: 'Flexibility' }
        ]
      }

      store.houses = [complexHouse]

      expect(store.houses).toHaveLength(1)
      expect(store.houses[0]).toEqual(complexHouse)
      expect(store.houses[0].heads).toHaveLength(2)
      expect(store.houses[0].traits).toHaveLength(3)
    })
  })

  describe('UserSelectedHouse State Management', () => {
    it('should allow setting userSelectedHouse', () => {
      store.userSelectedHouse = mockHouses[0] // Gryffindor

      expect(store.userSelectedHouse).toEqual(mockHouses[0])
      expect(store.userSelectedHouse?.name).toBe('Gryffindor')
      expect(store.userSelectedHouse?.founder).toBe('Godric Gryffindor')
    })

    it('should allow changing userSelectedHouse', () => {
      // Set initial selection
      store.userSelectedHouse = mockHouses[0] // Gryffindor
      expect(store.userSelectedHouse?.name).toBe('Gryffindor')

      // Change selection
      store.userSelectedHouse = mockHouses[2] // Ravenclaw
      expect(store.userSelectedHouse?.name).toBe('Ravenclaw')
      expect(store.userSelectedHouse?.animal).toBe('Eagle')
    })

    it('should allow setting userSelectedHouse to null', () => {
      store.userSelectedHouse = mockHouses[1] // Hufflepuff
      expect(store.userSelectedHouse?.name).toBe('Hufflepuff')

      store.userSelectedHouse = null
      expect(store.userSelectedHouse).toBeNull()
    })

    it('should maintain full house data when selected', () => {
      const selectedHouse = mockHouses[3] // Slytherin
      store.userSelectedHouse = selectedHouse

      expect(store.userSelectedHouse?.houseColours).toBe('Green and silver')
      expect(store.userSelectedHouse?.ghost).toBe('Bloody Baron')
      expect(store.userSelectedHouse?.heads).toHaveLength(1)
      expect(store.userSelectedHouse?.traits).toHaveLength(4)
      expect(store.userSelectedHouse?.traits[0].name).toBe('Ambition')
    })
  })

  describe('MyHouse State Management', () => {
    it('should allow setting myHouse', () => {
      store.myHouse = mockHouses[1] // Hufflepuff

      expect(store.myHouse).toEqual(mockHouses[1])
      expect(store.myHouse?.name).toBe('Hufflepuff')
      expect(store.myHouse?.element).toBe('Earth')
    })

    it('should allow changing myHouse', () => {
      // Set initial house
      store.myHouse = mockHouses[2] // Ravenclaw
      expect(store.myHouse?.name).toBe('Ravenclaw')

      // Change house
      store.myHouse = mockHouses[0] // Gryffindor
      expect(store.myHouse?.name).toBe('Gryffindor')
      expect(store.myHouse?.commonRoom).toBe('Gryffindor Tower')
    })

    it('should allow setting myHouse to null', () => {
      store.myHouse = mockHouses[3] // Slytherin
      expect(store.myHouse?.name).toBe('Slytherin')

      store.myHouse = null
      expect(store.myHouse).toBeNull()
    })

    it('should maintain full house data when set', () => {
      const myHouse = mockHouses[0] // Gryffindor
      store.myHouse = myHouse

      expect(store.myHouse?.animal).toBe('Lion')
      expect(store.myHouse?.founder).toBe('Godric Gryffindor')
      expect(store.myHouse?.heads[0].firstName).toBe('Minerva')
      expect(store.myHouse?.traits).toHaveLength(4)
      expect(store.myHouse?.traits.map(t => t.name)).toContain('Courage')
    })
  })

  describe('Multiple State Interactions', () => {
    it('should allow setting all states independently', () => {
      store.houses = [...mockHouses]
      store.userSelectedHouse = mockHouses[0] // Gryffindor
      store.myHouse = mockHouses[1] // Hufflepuff

      expect(store.houses).toHaveLength(4)
      expect(store.userSelectedHouse?.name).toBe('Gryffindor')
      expect(store.myHouse?.name).toBe('Hufflepuff')
    })

    it('should allow userSelectedHouse and myHouse to be the same', () => {
      const sameHouse = mockHouses[2] // Ravenclaw
      store.userSelectedHouse = sameHouse
      store.myHouse = sameHouse

      expect(store.userSelectedHouse).toEqual(store.myHouse)
      expect(store.userSelectedHouse?.name).toBe('Ravenclaw')
      expect(store.myHouse?.name).toBe('Ravenclaw')
    })

    it('should allow userSelectedHouse and myHouse to be different', () => {
      store.userSelectedHouse = mockHouses[0] // Gryffindor
      store.myHouse = mockHouses[3] // Slytherin

      expect(store.userSelectedHouse?.name).toBe('Gryffindor')
      expect(store.myHouse?.name).toBe('Slytherin')
      expect(store.userSelectedHouse).not.toEqual(store.myHouse)
    })

    it('should handle mixed null and non-null states', () => {
      store.houses = [...mockHouses]
      store.userSelectedHouse = mockHouses[1] // Hufflepuff
      store.myHouse = null

      expect(store.houses).toHaveLength(4)
      expect(store.userSelectedHouse?.name).toBe('Hufflepuff')
      expect(store.myHouse).toBeNull()
    })
  })

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // Set state to ensure types work
      store.houses = mockHouses
      store.userSelectedHouse = mockHouses[0]
      store.myHouse = mockHouses[1]

      // Access properties to ensure types are correct
      const housesCount: number = store.houses?.length || 0
      const selectedHouseName: string = store.userSelectedHouse?.name || ''
      const myHouseName: string = store.myHouse?.name || ''
      const selectedHouseTraits = store.userSelectedHouse?.traits || []

      expect(typeof housesCount).toBe('number')
      expect(typeof selectedHouseName).toBe('string')
      expect(typeof myHouseName).toBe('string')
      expect(Array.isArray(selectedHouseTraits)).toBe(true)
    })

    it('should handle nullable types correctly', () => {
      // Test null states
      store.houses = null
      store.userSelectedHouse = null
      store.myHouse = null

      expect(store.houses).toBeNull()
      expect(store.userSelectedHouse).toBeNull()
      expect(store.myHouse).toBeNull()

      // Should not throw when accessing properties of null values
      expect(store.houses?.length).toBeUndefined()
      expect(store.userSelectedHouse?.name).toBeUndefined()
      expect(store.myHouse?.traits).toBeUndefined()
    })

    it('should properly type nested objects', () => {
      store.userSelectedHouse = mockHouses[0]

      // Access nested properties to ensure types work
      const headFirstName = store.userSelectedHouse?.heads[0]?.firstName
      const traitName = store.userSelectedHouse?.traits[0]?.name
      const houseElement = store.userSelectedHouse?.element

      expect(typeof headFirstName).toBe('string')
      expect(typeof traitName).toBe('string')
      expect(typeof houseElement).toBe('string')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty houses array', () => {
      store.houses = []

      expect(store.houses).toEqual([])
      expect(store.houses).toHaveLength(0)
    })

    it('should handle houses with minimal data', () => {
      const minimalHouse: HouseInterface = {
        id: 'minimal',
        name: 'Minimal House',
        houseColours: 'Black and white',
        founder: 'Unknown',
        animal: 'Cat',
        element: 'Void',
        ghost: 'No ghost',
        commonRoom: 'Nowhere',
        heads: [],
        traits: []
      }

      store.userSelectedHouse = minimalHouse

      expect(store.userSelectedHouse.heads).toHaveLength(0)
      expect(store.userSelectedHouse.traits).toHaveLength(0)
      expect(store.userSelectedHouse.name).toBe('Minimal House')
    })

    it('should handle rapid state changes', () => {
      // Rapid changes to test reactivity
      store.userSelectedHouse = mockHouses[0]
      store.userSelectedHouse = mockHouses[1]
      store.userSelectedHouse = mockHouses[2]
      store.userSelectedHouse = mockHouses[3]

      expect(store.userSelectedHouse?.name).toBe('Slytherin')

      store.myHouse = mockHouses[3]
      store.myHouse = mockHouses[2]
      store.myHouse = mockHouses[1]
      store.myHouse = mockHouses[0]

      expect(store.myHouse?.name).toBe('Gryffindor')
    })
  })
})