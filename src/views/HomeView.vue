<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBuilding, faBolt, faFlask, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'

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
  }, 1200) // Increased timeout to match new animation duration
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
                <div class="coin-wrapper" :class="{ 'sparkling': coin.isSpinning }">
                  <div class="coin-effects-container">
                    <img
                      src="../assets/images/coin_home.png"
                      alt="magic coin"
                      class="coin-image drop-shadow-xl transition-all duration-300"
                      :class="{ 'animate-coin-spin': coin.isSpinning }"
                    >
                    <!-- Sparkle particles - Multiple layers for maximum sparkle! -->
                    <div v-if="coin.isSpinning" class="sparkles-container">
                      <div v-for="i in 24" :key="`main-${i}`" class="sparkle sparkle-main" :style="{ '--delay': i * 0.05 + 's', '--angle': i * 15 + 'deg' }"></div>
                      <div v-for="i in 16" :key="`inner-${i}`" class="sparkle sparkle-inner" :style="{ '--delay': i * 0.07 + 's', '--angle': i * 22.5 + 'deg' }"></div>
                      <div v-for="i in 32" :key="`outer-${i}`" class="sparkle sparkle-outer" :style="{ '--delay': i * 0.03 + 's', '--angle': i * 11.25 + 'deg' }"></div>
                      <div v-for="i in 20" :key="`micro-${i}`" class="sparkle sparkle-micro" :style="{ '--delay': i * 0.08 + 's', '--angle': i * 18 + 'deg' }"></div>
                    </div>
                    <div v-if="coin.isSpinning" class="magic-ring"></div>
                  </div>
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
  position: relative;
}

.coin-effects-container {
  position: relative;
  display: inline-block;
  transition: transform 0.3s ease;
}

.sparkles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #ffd700 0%, #ffed4e 50%, transparent 70%);
  border-radius: 50%;
  animation: sparkle-burst 1.2s ease-out var(--delay, 0s);
  transform-origin: center;
}

.sparkle:nth-child(odd) {
  background: radial-gradient(circle, #87ceeb 0%, #add8e6 50%, transparent 70%);
}

.sparkle:nth-child(3n) {
  background: radial-gradient(circle, #dda0dd 0%, #e6e6fa 50%, transparent 70%);
  animation-duration: 1.4s;
}

.magic-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%);
  border: 2px solid transparent;
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 40%, rgba(255, 215, 0, 0.3) 41%, rgba(255, 215, 0, 0.3) 42%, transparent 43%),
    conic-gradient(from 0deg, transparent, #ffd700, transparent, #87ceeb, transparent, #dda0dd, transparent);
  animation: magic-ring-spin 1.2s linear;
  pointer-events: none;
  opacity: 0.8;
}

@keyframes sparkle-burst {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0px) scale(0);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-30px) scale(0.8);
    opacity: 1;
  }
  40% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-60px) scale(1);
    opacity: 0.9;
  }
  60% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-90px) scale(1.2);
    opacity: 0.7;
  }
  80% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-120px) scale(0.6);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-150px) scale(0);
    opacity: 0;
  }
}

@keyframes magic-ring-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  30% {
    transform: translate(-50%, -50%) rotate(180deg) scale(1);
    opacity: 0.8;
  }
  70% {
    transform: translate(-50%, -50%) rotate(540deg) scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg) scale(1.3);
    opacity: 0;
  }
}

.coin-image {
  width: 200px;
  height: 200px;
  animation: bounce-slow 3s infinite;
  transform-style: preserve-3d;
}

.coin-image.animate-coin-spin {
  animation: coin-spin 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
  filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4));
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
  /* Slow start - first 30% */
  0% {
    transform: rotateY(0deg) translateY(0);
  }
  15% {
    transform: rotateY(90deg) translateY(-5px);
  }
  30% {
    transform: rotateY(180deg) translateY(-8px);
  }

  /* Medium speed - next 30% */
  45% {
    transform: rotateY(360deg) translateY(-12px);
  }
  60% {
    transform: rotateY(540deg) translateY(-15px);
  }

  /* Very fast finish - last 40% */
  70% {
    transform: rotateY(900deg) translateY(-18px);
  }
  80% {
    transform: rotateY(1260deg) translateY(-20px);
  }
  90% {
    transform: rotateY(1620deg) translateY(-15px);
  }
  95% {
    transform: rotateY(1800deg) translateY(-10px);
  }
  100% {
    transform: rotateY(1980deg) translateY(0);
  }
}

.animate-coin-spin {
  animation: coin-spin 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
  filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4));
}

@media (min-width: 768px) {
  .coin-container:hover .coin-effects-container {
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
}</style>