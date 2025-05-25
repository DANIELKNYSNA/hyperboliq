<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBuilding, faBolt, faFlask, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'

library.add(faBuilding, faBolt, faFlask, faArrowRight)

const router = useRouter()
const userStore = useUserStore()
const userAuthed = computed(() => userStore.isAuthenticated)
const isDarkMode = computed(() => useUiStore().isDarkMode)
// We need a local mode to avoid flickering on the background image when the change is made
const localDarkMode = ref(isDarkMode.value)
const backgroundVisible = ref(false)

const icons = {
  houses: faBuilding,
  spells: faBolt,
  elixirs: faFlask,
  arrowRight: faArrowRight,
}
const coins = ref([
  {
    title: 'Houses',
    description: 'Explore the different houses of the wizarding world.',
    icon: 'houses',
    route: '/houses',
    visible: false,
    isSpinning: false,
  },
  {
    title: 'Spells',
    description: 'Discover various spells from the wizarding world.',
    icon: 'spells',
    route: '/spells',
    visible: false,
    isSpinning: false,
  },
  {
    title: 'Elixirs',
    description: 'Explore magical elixirs and potions from the wizarding world.',
    icon: 'elixirs',
    route: '/elixirs',
    visible: false,
    isSpinning: false,
  },
])
const navigateTo = (route: string, cardIndex: number) => {
  coins.value[cardIndex].isSpinning = true
  setTimeout(() => {
    router.push(route)
  }, 600)
}
const startAnimations = () => {
  backgroundVisible.value = false
  coins.value.forEach(card => {
    card.visible = false
  })
  setTimeout(() => {
    localDarkMode.value = isDarkMode.value
  }, 1300)
  setTimeout(() => {
    setTimeout(() => {
      backgroundVisible.value = true
    }, 300)
    coins.value.forEach((card, index) => {
      setTimeout(() => {
        card.visible = true
      }, 1200 + (200 * index))
    })
  }, 1000)
}
watch(
  () => isDarkMode.value,
  () => {
    startAnimations()
  }
)
onMounted(() => {
  startAnimations()
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 bg-hogwarts-light"
      :class="{ 'bg-hogwarts': localDarkMode }">
    </div>
    <div
      class="fixed top-0 left-0 w-full h-full -z-20 bg-black/95 transition-all duration-[2800ms] ease-out"
      :class="{ 'bg-radial-burn': backgroundVisible }"
    >
    </div>

    <main class="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
      <template v-if="!userAuthed">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-lg transition-colors duration-200 text-outlined">
              Welcome to the <span class="text-yellow-400 drop-shadow-md text-outlined-yellow">Wizarding World</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md transition-colors duration-200 text-outlined-subtle">
              Please login or create an account here <RouterLink to="/login" class="text-yellow-400 hover:text-yellow-300">Login</RouterLink>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-lg transition-colors duration-200 text-outlined">
              Welcome to the <span class="text-yellow-400 drop-shadow-md text-outlined-yellow">Wizarding World</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md transition-colors duration-200 text-outlined-subtle">
              Explore the magical universe through our interactive catalog
            </p>
          </div>
          <div class="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
            <div
              v-for="(coin, index) in coins"
              :key="index"
              class="w-full max-w-sm flex justify-center opacity-0 translate-y-8 transition-all duration-600 ease-out coin-container"
              :class="{
                'opacity-100 translate-y-0': coin.visible
              }"
            >
              <div
                class="flex flex-col items-center justify-center w-full cursor-pointer relative transition-transform duration-300 hover:-translate-y-3 hover:scale-105 active:scale-95 active:opacity-90"
                @click="navigateTo(coin.route, index)"
              >
                <h3 class="text-white text-lg font-semibold mb-4 drop-shadow-md text-outlined-small">
                  {{ coin.title }}
                </h3>
                <div class="coin-wrapper">
                  <img
                    src="../assets/images/coin_home.png"
                    alt="magic coin"
                    class="coin-image drop-shadow-xl transition-all duration-300"
                    :class="{ 'animate-coin-spin': coin.isSpinning }"
                  >
                </div>
                <FontAwesomeIcon
                  :icon="icons[coin.icon as keyof typeof icons]"
                  class="text-2xl sm:text-3xl text-white mt-4 drop-shadow-lg z-10 relative transition-all duration-300 icon-glow"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.bg-hogwarts-light {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
}

.bg-hogwarts {
  background-image: url('../assets/images/UkSkylineColour.jpg');
}

.coin-wrapper {
  perspective: 1000px;
}

.coin-image {
  width: 200px;
  height: 200px;
  animation: bounce-slow 3s infinite;
  transform-style: preserve-3d;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.coin-container:nth-child(1) .coin-image {
  animation-delay: 0s;
}

.coin-container:nth-child(2) .coin-image {
  animation-delay: 0.75s;
}

.coin-container:nth-child(3) .coin-image {
  animation-delay: 1.5s;
}

.coin-container:nth-child(4) .coin-image {
  animation-delay: 2.25s;
}

@keyframes coin-spin {
  0% {
    transform: rotateY(0deg) translateY(0);
  }
  25% {
    transform: rotateY(180deg) translateY(-5px);
  }
  50% {
    transform: rotateY(360deg) translateY(-10px);
  }
  75% {
    transform: rotateY(540deg) translateY(-5px);
  }
  100% {
    transform: rotateY(720deg) translateY(0);
  }
}

.animate-coin-spin {
  animation: coin-spin 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}



@media (min-width: 768px) {
  .coin-container:hover > div {
    transform: translateY(-12px) scale(1.008);
  }

  .coin-container:hover .coin-image {
    filter: brightness(1.1) drop-shadow(0 8px 16px rgba(255, 215, 0, 0.3));
  }

  .coin-container .icon-glow {
    filter: drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))
            drop-shadow(0 0 32px rgba(255, 215, 0, 0.5))
            drop-shadow(0 0 48px rgba(255, 215, 0, 0.2));
    color: #ffd700;
  }
}
</style>