<script setup lang="ts">
import { ref, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBuilding, faBolt, faFlask, faArrowRight } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faBuilding, faBolt, faFlask, faArrowRight)

const router = useRouter()
// Inject the dark mode state from App.vue
const isDarkMode = inject('isDarkMode', ref(false))

// Icon mapping for easy reference
const icons = {
  houses: faBuilding,
  spells: faBolt,
  elixirs: faFlask,
  arrowRight: faArrowRight
}

const menuCards = ref([
  {
    title: 'Houses',
    description: 'Explore the different houses of the wizarding world.',
    icon: 'houses',
    route: '/houses',
    visible: false,
  },
  {
    title: 'Spells',
    description: 'Discover various spells from the wizarding world.',
    icon: 'spells',
    route: '/spells',
    visible: false,
  },
  {
    title: 'Elixirs',
    description: 'Explore magical elixirs and potions from the wizarding world.',
    icon: 'elixirs',
    route: '/elixirs',
    visible: false,
  },
])

// Computed property for card colors based on theme
const cardColor = computed(() => {
  return isDarkMode.value ? 'bg-indigo-900' : 'bg-indigo-600'
})

const navigateTo = (route: string) => {
  router.push(route)
}

onMounted(() => {
  // Staggered animation for cards
  menuCards.value.forEach((card, index) => {
    setTimeout(() => {
      card.visible = true
    }, 200 * (index + 1))
  })
})
</script>

<template>
  <main class="py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Welcome to the <span class="text-indigo-600 dark:text-indigo-400">Wizarding World</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-200">
          Explore the magical universe through our interactive catalog
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center"
      >
        <div
          v-for="(card, index) in menuCards"
          :key="index"
          class="card-container w-full flex justify-center"
          :class="{ 'card-visible': card.visible }"
        >
          <Card
            class="w-full max-w-md cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
            @click="navigateTo(card.route)"
          >
            <template #header>
              <div
                :class="[
                  cardColor,
                  'h-36 sm:h-40 flex items-center justify-center text-white rounded-t-lg transition-colors duration-200'
                ]"
              >
                <font-awesome-icon :icon="icons[card.icon as keyof typeof icons]" class="text-5xl sm:text-6xl" />
              </div>
            </template>
            <template #title>
              <div class="text-xl sm:text-2xl font-bold px-1">{{ card.title }}</div>
            </template>
            <template #content>
              <p class="mb-4 flex-grow px-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ card.description }}</p>
            </template>
            <template #footer>
              <div class="flex justify-end pt-2">
                <Button class="flex items-center" @click="navigateTo(card.route)">
                  Explore
                  <font-awesome-icon :icon="icons.arrowRight" class="ml-2" />
                </Button>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-container {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.card-visible {
  opacity: 1;
  transform: translateY(0);
}

.card-container:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

.card-container:active {
  transform: scale(0.98) !important;
  opacity: 0.9 !important;
}

@media (min-width: 768px) {
  .card-container:hover {
    transform: translateY(-8px) scale(1.02);
  }
}
</style>