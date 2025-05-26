<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import Dialog from 'primevue/dialog'
import type { HouseInterface } from '@/interfaces/house'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExclamationTriangle, faFeather, faFire, faMagic, faSeedling, faSpinner, faTint, faPalette, faPaw, faCrown, faInfoCircle, faUsers, faHeart, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { useHouses } from '@/composables/useHouses'
import { useHouseStore } from '@/stores/houseStore'
import { useUserStore } from '@/stores/userStore'

const { houses: housesData, isLoading, isError, error, refetch } = useHouses()

const showDetailsDialog = ref(false)
const selectedHouse = ref<HouseInterface | null>(null)
const houseStore = useHouseStore()
const userStore = useUserStore()

const isAdmin = computed(() => userStore.isAdmin)
const myHouse = computed(() => houseStore.myHouse)

const houses = computed(() => {
  if (!housesData.value) return []
  return housesData.value.map(house => ({
    ...house,
    housePoints: house.housePoints || 100
  }))
})

watch(housesData, (newHouses) => {
  if (newHouses) {
    houseStore.houses = newHouses.map(house => ({
      ...house,
      housePoints: house.housePoints || 100
    }))
  }
}, { immediate: true })

function updateHousePoints(houseId: string, points: number) {
  const house = houses.value?.find((h) => h.id === houseId)
  if (house) {
    house.housePoints = points
    // Update in store as well
    const storeHouse = houseStore.houses?.find((h) => h.id === houseId)
    if (storeHouse) {
      storeHouse.housePoints = points
    }
  }
}

function selectHouse(house: HouseInterface) {
  selectedHouse.value = house
  showDetailsDialog.value = true
}

function awardPoints(house: HouseInterface, points: number) {
  updateHousePoints(house.id, (house.housePoints ?? 0) + points)
}

function removePoints(house: HouseInterface, points: number) {
  updateHousePoints(house.id, (house.housePoints ?? 0) - points)
}

function getHouseIcon(houseName: string) {
  const icons = {
    'Gryffindor': faFire,
    'Hufflepuff': faSeedling,
    'Ravenclaw': faFeather,
    'Slytherin': faTint
  }
  return icons[houseName as keyof typeof icons] || 'fas fa-home'
}

function getHouseGradient(houseName: string) {
  const gradients = {
    'Gryffindor': 'linear-gradient(135deg, #ae0001 0%, #ffd700 100%)',
    'Hufflepuff': 'linear-gradient(135deg, #ffdb00 0%, #000000 100%)',
    'Ravenclaw': 'linear-gradient(135deg, #0e1a40 0%, #946b2d 100%)',
    'Slytherin': 'linear-gradient(135deg, #1a472a 0%, #aaaaaa 100%)'
  }
  return gradients[houseName as keyof typeof gradients] || 'linear-gradient(135deg, #666 0%, #999 100%)'
}

function getHouseNameColor(houseName: string) {
  const colorClasses = {
    'Gryffindor': 'gryffindor',
    'Hufflepuff': 'hufflepuff',
    'Ravenclaw': 'ravenclaw',
    'Slytherin': 'slytherin'
  }
  return colorClasses[houseName as keyof typeof colorClasses] || ''
}

function setMyHouse(house: HouseInterface) {
  if (houseStore.myHouse) {
    removePoints(houseStore.myHouse, 10)
  }
  houseStore.myHouse = house
  awardPoints(house, 10)
}

function handleRetry() {
  refetch()
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 house-background"></div>
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-4 text-white drop-shadow-lg transition-colors duration-200 text-outlined">
        <FontAwesomeIcon :icon="faMagic" class="mr-4 text-black" />
        Houses of <span class="text-yellow-400 drop-shadow-md text-outlined-yellow">Hogwarts</span>
      </h1>
      <p class="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md transition-colors duration-200 text-outlined-subtle">
        Choose your house and discover the magic within
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16 px-8">
      <div class="text-5xl text-purple-600 mb-4">
        <FontAwesomeIcon :icon="faSpinner" class="animate-spin" />
      </div>
      <p class="text-lg text-white drop-shadow-md">Summoning houses from Hogwarts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="text-center py-16 px-8">
      <div class="bg-red-500/90 backdrop-blur-sm rounded-2xl p-8 text-white max-w-md mx-auto">
        <FontAwesomeIcon :icon="faExclamationTriangle" class="text-4xl mb-4" />
        <p class="text-lg mb-4">{{ error?.message || 'Failed to load houses' }}</p>
        <Button
          label="Try Again"
          icon="fas fa-redo"
          @click="handleRetry"
          class="!bg-white !text-red-500 font-semibold"
        />
      </div>
    </div>

    <!-- Houses Grid -->
    <div v-else-if="houses && houses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <Card
        v-for="house in houses"
        :key="house.id"
        :class="['cursor-pointer transition-all duration-300 border-none rounded-3xl overflow-hidden shadow-lg hover:-translate-y-3 hover:shadow-2xl', house.name.toLowerCase()]"
        @click="selectHouse(house)"
      >
        <template #header>
          <div class="h-22 relative flex items-center justify-between p-8 text-white" :style="{ background: getHouseGradient(house.name) }">
            <div class="text-5xl opacity-80">
              <FontAwesomeIcon :icon="getHouseIcon(house.name)" />
            </div>
            <div class="absolute right-8 top-1/2 -translate-y-1/2">
              <div class="w-15 h-15 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                {{ house.name.charAt(0) }}
              </div>
            </div>
          </div>
        </template>
        <template #title>
          <div class="flex flex-col md:flex-row justify-between items-center mb-4 ">
            <h2 class="text-3xl font-bold m-0" :class="getHouseNameColor(house.name)">{{ house.name }}</h2>
            <div class="flex items-center">
              <span class="text-sm mr-2">House pts:</span>
              <Badge
                :value="house.housePoints || 0"
                severity="secondary"
                class="font-semibold"
                size="large"
              >
                <template #default>
                  {{ house.housePoints || 0 }}
                </template>
              </Badge>
            </div>
          </div>
        </template>
        <template #content>
          <div class="px-4 pb-4">
            <div class="mb-6">
              <div class="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon :icon="faCrown" class="mr-2 w-5 text-purple-600" />
                <span class="text-lg">{{ house.founder }}</span>
              </div>
              <div class="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon :icon="faPaw" class="mr-2 w-5 text-purple-600" />
                <span>{{ house.animal }}</span>
              </div>
              <div class="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon :icon="faPalette" class="mr-2 w-5 text-purple-600" />
                <span>{{ house.houseColours }}</span>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="mb-2 text-gray-800 font-semibold">House Traits</h4>
              <div class="flex flex-wrap gap-2 mb-6">
                <Chip
                  v-for="trait in house.traits?.slice(0, 3)"
                  :key="trait.id"
                  :label="trait.name"
                  class="text-sm"
                />
                <Chip
                  v-if="house.traits?.length > 3"
                  :label="`+${house.traits.length - 3} more`"
                  class="text-sm !bg-gray-200 !text-gray-600"
                />
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-2 justify-between">
              <Button
                label="View Details"
                icon="fas fa-eye"
                class="flex-1"
                outlined
              />
              <Button
                v-if="isAdmin"
                label="Award Points"
                icon="fas fa-plus"
                class="flex-shrink-0"
                @click.stop="awardPoints(house, 10)"
                size="small"
              />
              <Button
                v-if="myHouse?.id !== house.id"
                label="My House"
                icon="fas fa-heart"
                @click.stop="setMyHouse(house)"
                outlined
                class="flex-shrink-0 !bg-gradient-to-r !from-red-400 !to-red-500 !border-none !text-gray-800 font-semibold"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 px-8">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
        <FontAwesomeIcon :icon="faInfoCircle" class="text-4xl text-gray-400 mb-4" />
        <p class="text-lg text-gray-600">No houses found</p>
      </div>
    </div>

    <!-- Details Dialog -->
    <Dialog
      v-model:visible="showDetailsDialog"
      :header="selectedHouse?.name + ' House Details'"
      :modal="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div v-if="selectedHouse" class="p-0">
        <div class="p-8 text-white flex items-center gap-8 -mx-6 -mt-6 mb-0" :style="{ background: getHouseGradient(selectedHouse.name) }">
          <div class="w-25 h-25 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-2 border-white/30">
            {{ selectedHouse.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <h2 class="m-0 mb-2 text-4xl font-bold">{{ selectedHouse.name }}</h2>
            <p class="m-0 mb-4 opacity-90 text-lg">Founded by {{ selectedHouse.founder }}</p>
            <div class="flex align-center gap-2">
              <Badge
                :value="selectedHouse.housePoints || 0"
                severity="secondary"
                size="large"
              >
                <template #default>
                  {{ selectedHouse.housePoints || 0 }}
                </template>
              </Badge>
              <span class="self-end">House Points</span>
            </div>
          </div>
        </div>

        <div class="p-8">
          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-gray-800 text-xl font-semibold">
              <FontAwesomeIcon :icon="faInfoCircle" class="text-purple-600" />
              House Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-200">
                <strong class="mr-2">Animal:</strong> {{ selectedHouse.animal }}
              </div>
              <div class="py-2 border-b border-gray-200">
                <strong class="mr-2">Element:</strong> {{ selectedHouse.element }}
              </div>
              <div class="py-2 border-b border-gray-200">
                <strong class="mr-2">Ghost:</strong> {{ selectedHouse.ghost }}
              </div>
              <div class="py-2 border-b border-gray-200">
                <strong class="mr-2">Common Room:</strong> {{ selectedHouse.commonRoom }}
              </div>
              <div class="py-2 border-b border-gray-200 md:col-span-2">
                <strong class="mr-2">Colors:</strong> {{ selectedHouse.houseColours }}
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-gray-800 text-xl font-semibold">
              <FontAwesomeIcon :icon="faUsers" class="text-purple-600" />
              House Heads
            </h3>
            <div class="flex flex-wrap gap-4">
              <div v-for="head in selectedHouse.heads" :key="head.id" class="flex items-center gap-2 py-2 px-4 bg-gray-50 rounded-full text-gray-800">
                <FontAwesomeIcon :icon="faUserTie" class="text-2xl" />
                {{ head.firstName }} {{ head.lastName }}
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-gray-800 text-xl font-semibold">
              <FontAwesomeIcon :icon="faHeart" class="text-purple-600" />
              Traits
            </h3>
            <div class="flex flex-wrap gap-2">
              <Chip
                v-for="trait in selectedHouse.traits"
                :key="trait.id"
                :label="trait.name"
                class="text-sm py-2 px-4"
              />
            </div>
          </div>
          <div class="flex gap-4 justify-center pt-4 border-t border-gray-200">
            <Button
              v-if="isAdmin"
              label="Award 10 Points"
              icon="fas fa-plus"
              @click="awardPoints(selectedHouse, 10)"
              class="py-3 px-6"
            />
            <Button
              v-if="isAdmin"
              label="Award 25 Points"
              icon="fas fa-star"
              @click="awardPoints(selectedHouse, 25)"
              class="py-3 px-6 !bg-gradient-to-r !from-yellow-400 !to-yellow-500 !border-none !text-gray-800 font-semibold"
            />
            <Button
              v-if="myHouse?.id !== selectedHouse.id"
              label="My House"
              icon="fas fa-heart"
              @click.stop="setMyHouse(selectedHouse)"
              outlined
              class="flex-shrink-0 !bg-gradient-to-r !from-red-400 !to-red-500 !border-none !text-gray-800 font-semibold"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.house-background {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
}

.gryffindor .house-name {
  color: #ae0001;
}

.hufflepuff .house-name {
  color: #ffdb00;
}

.ravenclaw .house-name {
  color: #0e1a40;
}

.slytherin .house-name {
  color: #1a472a;
}

@media (max-width: 768px) {
  .dialog-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>