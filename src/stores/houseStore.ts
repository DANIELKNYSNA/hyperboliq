import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HouseInterface } from '@/interfaces/house'
export const useHouseStore = defineStore('houseStore', () => {
  const houses = ref<HouseInterface[] | null>(null)
  const userSelectedHouse = ref<HouseInterface | null>(null)
  const myHouse = ref<HouseInterface | null>(null)

  return {
    houses,
    userSelectedHouse,
    myHouse,
  }
},
{
  persist: true
}
)