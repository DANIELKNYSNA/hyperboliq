import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type House = {
  id: string
  name: string
  founder: string
  house_points: number
}

export const useWizardingWorldStore = defineStore('wizardingWorld', () => {
  const data = ref<House[]>([
    { id: '1', name: 'Gryffindor', founder: 'Godric Gryffindor', house_points: 482 },
    { id: '2', name: 'Hufflepuff', founder: 'Helga Hufflepuff', house_points: 352 },
    { id: '3', name: 'Ravenclaw', founder: 'Rowena Ravenclaw', house_points: 426 },
    { id: '4', name: 'Slytherin', founder: 'Salazar Slytherin', house_points: 472 },
  ])
  const selectedHouse = ref<House | null>(null)
  const loading = ref(false)
  const spells = ref([
    { id: '1', name: 'Expelliarmus', effect: 'Disarming Charm', type: 'Charm' },
    { id: '2', name: 'Lumos', effect: 'Creates light from wand tip', type: 'Charm' },
    { id: '3', name: 'Expecto Patronum', effect: 'Conjures a Patronus', type: 'Charm' },
    { id: '4', name: 'Wingardium Leviosa', effect: 'Levitation Charm', type: 'Charm' },
    { id: '5', name: 'Accio', effect: 'Summoning Charm', type: 'Charm' },
  ])
  const tracker = ref({
    visitCount: 0,
    lastViewedSpell: '',
  })

  const totalHousePoints = computed(() => {
    return data.value.reduce((total, house) => total + house.house_points, 0)
  })

  const getSpellsByType = (type: string) => {
    return spells.value.filter((spell) => spell.type === type)
  }

  const getSelectedHouse = computed(() => selectedHouse.value)

  async function fetchHouses() {
    loading.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        loading.value = false
        resolve(data.value)
      }, 1000)
    })
  }

  function selectHouse(houseId: string) {
    const house = data.value.find((h) => h.id === houseId)
    if (house) {
      selectedHouse.value = house
      document.title = `Selected: ${house.name}`
    }
  }

  function getHouseById(id: string) {
    return data.value.find((house) => house.id === id)
  }

  function updateHousePoints(houseId: string, points: number) {
    const house = data.value.find((h) => h.id === houseId)
    if (house) {
      house.house_points = points
      localStorage.setItem('housePoints', JSON.stringify(data.value))
      return true
    }
  }

  function addSpell(name: string, effect: string, type: string) {
    const newId = (parseInt(spells.value[spells.value.length - 1].id) + 1).toString()
    spells.value.push({ id: newId, name, effect, type })
  }

  function filterSpells(filterText: string) {
    tracker.value.visitCount++
    return spells.value.filter((spell) => {
      return (
        spell.name.toLowerCase().includes(filterText.toLowerCase()) ||
        spell.effect.toLowerCase().includes(filterText.toLowerCase()) ||
        spell.type.toLowerCase().includes(filterText.toLowerCase())
      )
    })
  }

  return {
    data,
    selectedHouse,
    loading,
    spells,
    tracker,
    totalHousePoints,
    getSpellsByType,
    getSelectedHouse,
    fetchHouses,
    selectHouse,
    getHouseById,
    updateHousePoints,
    addSpell,
    filterSpells
  }
})
