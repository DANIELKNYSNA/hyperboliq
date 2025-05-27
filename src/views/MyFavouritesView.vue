<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFlask, faHeart, faMagic, faShield, faHome, faCrown, faWandMagicSparkles, faLeaf, faClock, faIndustry, faChartLine, faEye, faFire, faTrophy, faHistory } from '@fortawesome/free-solid-svg-icons'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import { useSpellStore } from '@/stores/spellStore'
import { useElixirStore } from '@/stores/elixirStore'
import { useHouseStore } from '@/stores/houseStore'
import { useUiStore } from '@/stores/uiStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const spellStore = useSpellStore()
const elixirStore = useElixirStore()
const houseStore = useHouseStore()
const uiStore = useUiStore()

const myHouse = computed(() => houseStore.myHouse)
const likedSpells = computed(() => spellStore.likedSpells || [])
const likedElixirs = computed(() => elixirStore.likedElixirs || [])
const totalFavorites = computed(() => likedSpells.value.length + likedElixirs.value.length + (myHouse.value ? 1 : 0))

const totalVisits = computed(() => uiStore.tracker.totalVisitCount)
const mostVisitedPageName = computed(() => uiStore.getMostVisitedPageDisplayName)
const recentVisits = computed(() => uiStore.getVisitHistoryWithNames.slice(0, 5))
const lastViewedSpell = computed(() => uiStore.tracker.lastViewedSpell)
const pageVisits = computed(() => uiStore.tracker.pageVisits)

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getHouseColors = (houseName: string) => {
  // We could in the future have the entire site run off the colours of the chosen house - ie a theme
  const houseColors = {
    'Gryffindor': {
      primary: '#7C2D12', // Dark red
      secondary: '#FCD34D', // Gold
      background: 'bg-gradient-to-br from-red-800 to-yellow-600',
      badge: 'danger',
      accent: 'text-red-600'
    },
    'Slytherin': {
      primary: '#14532D', // Dark green
      secondary: '#D1D5DB', // Silver
      background: 'bg-gradient-to-br from-green-800 to-gray-600',
      badge: 'success',
      accent: 'text-green-600'
    },
    'Ravenclaw': {
      primary: '#1E3A8A', // Dark blue
      secondary: '#92400E', // Bronze
      background: 'bg-gradient-to-br from-blue-800 to-yellow-700',
      badge: 'info',
      accent: 'text-blue-600'
    },
    'Hufflepuff': {
      primary: '#92400E', // Dark yellow/brown
      secondary: '#374151', // Black
      background: 'bg-gradient-to-br from-yellow-700 to-gray-800',
      badge: 'warning',
      accent: 'text-yellow-600'
    }
  }
  return houseColors[houseName as keyof typeof houseColors] || houseColors['Gryffindor']
}

const getSpellTypeSeverity = (type: string) => {
  const severityMap: Record<string, string> = {
    'Charm': 'info',
    'Curse': 'danger',
    'Jinx': 'warning',
    'Hex': 'warning',
    'Counter-spell': 'success',
    'Healing spell': 'success'
  }
  return severityMap[type] || 'secondary'
}

const getDifficultySeverity = (difficulty: string) => {
  const severityMap: Record<string, string> = {
    'Unknown': 'secondary',
    'Beginner': 'success',
    'Intermediate': 'info',
    'Advanced': 'warning',
    'Expert': 'danger'
  }
  return severityMap[difficulty] || 'secondary'
}

const removeSpellFromFavorites = (spellId: string) => {
  const index = likedSpells.value.findIndex(spell => spell.id === spellId)
  if (index > -1) {
    spellStore.likedSpells.splice(index, 1)
  }
}

const removeElixirFromFavorites = (elixirId: string) => {
  const index = likedElixirs.value.findIndex(elixir => elixir.id === elixirId)
  if (index > -1) {
    elixirStore.likedElixirs.splice(index, 1)
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 bg-hogwarts-light">
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2 text-shadow">
          <FontAwesomeIcon :icon="faHeart" class="mr-3 text-red-400" />
          My Favourites
        </h1>
        <p class="text-xl text-gray-200 text-shadow">Your personal collection from the wizarding world</p>
        <Badge v-if="totalFavorites > 0" :value="`${totalFavorites} items`" severity="info" class="mt-2" size="large" />
      </div>

      <!-- Analytics Card -->
      <Card class="analytics-card glass-effect mb-8">
        <template #header>
          <div class="card-header analytics-header">
            <FontAwesomeIcon :icon="faChartLine" />
            <h2>Your Wizarding Journey Analytics</h2>
          </div>
        </template>
        <template #content>
          <div class="analytics-content">
            <!-- Top Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="stat-card">
                <div class="stat-icon">
                  <FontAwesomeIcon :icon="faEye" class="text-2xl text-blue-500" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalVisits }}</div>
                  <div class="stat-label">Total Visits</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <FontAwesomeIcon :icon="faTrophy" class="text-2xl text-yellow-500" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ mostVisitedPageName || 'None' }}</div>
                  <div class="stat-label">Most Visited</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <FontAwesomeIcon :icon="faMagic" class="text-2xl text-purple-500" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ lastViewedSpell || 'None' }}</div>
                  <div class="stat-label">Last Spell Viewed</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <FontAwesomeIcon :icon="faHeart" class="text-2xl text-red-500" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalFavorites }}</div>
                  <div class="stat-label">Total Favourites</div>
                </div>
              </div>
            </div>

            <!-- Detailed Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Page Visit Breakdown -->
              <div class="analytics-section">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon :icon="faFire" class="text-orange-500" />
                  Page Visit Breakdown
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="(count, pageName) in pageVisits"
                    :key="pageName"
                    class="page-stat-item"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-medium">{{ uiStore.getPageDisplayName(pageName as keyof typeof pageVisits) }}</span>
                      <Badge :value="count" severity="info" />
                    </div>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: totalVisits > 0 ? `${(count / totalVisits) * 100}%` : '0%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="analytics-section">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon :icon="faHistory" class="text-green-500" />
                  Recent Activity
                </h3>
                <div v-if="recentVisits.length === 0" class="text-center py-4 text-gray-500">
                  No recent activity
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="(visit, index) in recentVisits"
                    :key="index"
                    class="activity-item"
                  >
                    <div class="flex items-center gap-3">
                      <div class="activity-dot"></div>
                      <div class="flex-1">
                        <div class="font-medium">{{ visit.displayName }}</div>
                        <div class="text-sm text-gray-500">{{ formatTime(visit.timestamp) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- My House Section -->
      <div v-if="myHouse" class="mb-8">
        <Card class="house-card glass-effect">
          <template #title>
            <div class="flex items-center gap-3">
              <FontAwesomeIcon :icon="faShield" class="text-3xl" :class="getHouseColors(myHouse.name).accent" />
              <span>My House</span>
              <Badge value="Selected" :severity="getHouseColors(myHouse.name).badge" class="ml-auto" />
            </div>
          </template>
          <template #content>
            <div class="house-content">
              <div class="house-header" :class="getHouseColors(myHouse.name).background">
                <div class="house-info">
                  <div class="flex items-center gap-4 mb-4">
                    <FontAwesomeIcon :icon="faCrown" class="text-4xl text-yellow-300" />
                    <div>
                      <h2 class="text-3xl font-bold text-white">{{ myHouse.name }}</h2>
                      <p class="text-xl text-gray-200">House of {{ myHouse.founder }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div class="house-details">
                      <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <FontAwesomeIcon :icon="faHome" />
                        House Details
                      </h3>
                      <div class="space-y-2 text-white">
                        <p><strong>Founder:</strong> {{ myHouse.founder }}</p>
                        <p><strong>Animal:</strong> {{ myHouse.animal }}</p>
                        <p><strong>Element:</strong> {{ myHouse.element }}</p>
                        <p><strong>Colors:</strong> {{ myHouse.houseColours }}</p>
                      </div>
                    </div>

                    <div class="house-traits">
                      <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <FontAwesomeIcon :icon="faWandMagicSparkles" />
                        House Traits
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <Chip
                          v-for="trait in myHouse.traits"
                          :key="trait.id"
                          :label="trait.name"
                          class="house-trait-chip"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- No House Selected -->
      <div v-else class="mb-8">
        <Card class="glass-effect">
          <template #content>
            <div class="text-center py-8">
              <FontAwesomeIcon :icon="faShield" class="text-6xl text-gray-400 mb-4" />
              <h3 class="text-xl font-semibold text-gray-300 mb-2">No House Selected</h3>
              <p class="text-gray-400 mb-4">Visit the Houses page to join your Hogwarts house!</p>
              <Button label="Choose Your House" @click="router.push('/houses')"/>
            </div>
          </template>
        </Card>
      </div>

      <!-- Favourites Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Favourite Spells -->
        <Card class="favourites-section glass-effect">
          <template #title>
            <div class="flex items-center gap-3">
              <FontAwesomeIcon :icon="faMagic" class="text-3xl text-purple-600" />
              <span>Favourite Spells</span>
              <Badge :value="likedSpells.length" severity="info" class="ml-auto" />
            </div>
          </template>
          <template #content>
            <div v-if="likedSpells.length === 0" class="text-center py-8">
              <FontAwesomeIcon :icon="faMagic" class="text-4xl text-gray-400 mb-4" />
              <p class="text-gray-500">No favourite spells yet</p>
              <p class="text-sm text-gray-400">Visit the Spells page to add some favourites!</p>
            </div>

            <div v-else class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="spell in likedSpells"
                :key="spell.id"
                class="spell-item p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-lg">{{ spell.name }}</h4>
                      <FontAwesomeIcon :icon="faHeart" class="text-red-500 text-sm animate-pulse" />
                    </div>
                    <Badge
                      :value="spell.type"
                      :severity="getSpellTypeSeverity(spell.type)"
                      class="mb-2"
                    />
                  </div>
                  <Button
                    @click="spell.id && removeSpellFromFavorites(spell.id)"
                    size="small"
                    severity="danger"
                    class="remove-btn"
                  >
                    <FontAwesomeIcon :icon="faHeart" />
                  </Button>
                </div>

                <p class="text-gray-700 text-sm mb-2">{{ spell.effect }}</p>

                <div v-if="spell.incantation" class="text-xs text-gray-500">
                  <strong>Incantation:</strong> <em>"{{ spell.incantation }}"</em>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Favourite Elixirs -->
        <Card class="favourites-section glass-effect">
          <template #title>
            <div class="flex items-center gap-3">
              <FontAwesomeIcon :icon="faFlask" class="text-3xl text-green-600" />
              <span>Favourite Elixirs</span>
              <Badge :value="likedElixirs.length" severity="success" class="ml-auto" />
            </div>
          </template>
          <template #content>
            <div v-if="likedElixirs.length === 0" class="text-center py-8">
              <FontAwesomeIcon :icon="faFlask" class="text-4xl text-gray-400 mb-4" />
              <p class="text-gray-500">No favourite elixirs yet</p>
              <p class="text-sm text-gray-400">Visit the Elixirs page to add some favourites!</p>
            </div>

            <div v-else class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="elixir in likedElixirs"
                :key="elixir.id"
                class="elixir-item p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-lg">{{ elixir.name }}</h4>
                      <FontAwesomeIcon :icon="faHeart" class="text-red-500 text-sm animate-pulse" />
                    </div>
                    <Badge
                      :value="elixir.difficulty"
                      :severity="getDifficultySeverity(elixir.difficulty)"
                      class="mb-2"
                    />
                  </div>
                  <Button
                    @click="removeElixirFromFavorites(elixir.id)"
                    size="small"
                    severity="danger"
                    class="remove-btn"
                  >
                    <FontAwesomeIcon :icon="faHeart" />
                  </Button>
                </div>

                <p class="text-gray-700 text-sm mb-3">{{ elixir.effect }}</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                  <div v-if="elixir.time">
                    <FontAwesomeIcon :icon="faClock" class="mr-1" />
                    <strong>Time:</strong> {{ elixir.time }}
                  </div>
                  <div v-if="elixir.manufacturer">
                    <FontAwesomeIcon :icon="faIndustry" class="mr-1" />
                    <strong>Made by:</strong> {{ elixir.manufacturer }}
                  </div>
                  <div v-if="elixir.ingredients && elixir.ingredients.length > 0" class="col-span-full">
                    <FontAwesomeIcon :icon="faLeaf" class="mr-1" />
                    <strong>Ingredients:</strong> {{ elixir.ingredients.length }} items
                  </div>
                </div>

                <div v-if="elixir.sideEffects" class="mt-3 p-2 bg-orange-50 border-l-3 border-orange-400 rounded">
                  <p class="text-xs text-orange-700">
                    <strong>Side Effects:</strong> {{ elixir.sideEffects }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="totalFavorites === 0" class="text-center mt-12">
        <Card class="glass-effect">
          <template #content>
            <div class="py-12">
              <FontAwesomeIcon :icon="faHeart" class="text-6xl text-gray-400 mb-6" />
              <h3 class="text-2xl font-semibold text-gray-300 mb-4">No Favourites Yet</h3>
              <p class="text-gray-400 mb-6">Start exploring the wizarding world and add items to your favourites!</p>
              <div class="flex gap-4 justify-center">
                <Button label="Explore Spells" icon="pi pi-magic" severity="info" />
                <Button label="Discover Elixirs" icon="pi pi-flask" severity="success" />
                <Button label="Choose House" icon="pi pi-shield" severity="warning" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-hogwarts-light {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Analytics Card Styles */
.analytics-card {
  border-left: 4px solid #3b82f6;
}

.analytics-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 0 0;
  margin: -1px -1px 0 -1px;
}

.analytics-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.analytics-content {
  padding: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.analytics-section {
  background: rgba(255, 255, 255, 0.6);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.page-stat-item {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 2px;
  transition: width 0.6s ease;
}

.activity-item {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.activity-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  flex-shrink: 0;
}

.house-card {
  overflow: hidden;
}

.house-content {
  padding: 0;
}

.house-header {
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.house-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
}

.house-info {
  position: relative;
  z-index: 1;
}

.house-trait-chip {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.favourites-section {
  height: fit-content;
}

.spell-item, .elixir-item {
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.spell-item:hover, .elixir-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(4px);
}

.remove-btn {
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Pulse animation for heart icons */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Dark Mode Support */
.dark .stat-card,
.dark .analytics-section,
.dark .page-stat-item,
.dark .activity-item {
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(75, 85, 99, 0.4);
}

.dark .analytics-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
}

.dark .stat-number {
  color: #e5e7eb;
}

.dark .stat-label {
  color: #9ca3af;
}

.dark .stat-icon {
  background: rgba(59, 130, 246, 0.2);
}

.dark .progress-bar {
  background: rgba(75, 85, 99, 0.3);
}

.dark .spell-item,
.dark .elixir-item {
  background: rgba(30, 30, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.dark .spell-item:hover,
.dark .elixir-item:hover {
  background: rgba(40, 40, 40, 0.9);
}

.dark .glass-effect {
  background: rgba(30, 30, 30, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .house-header {
    padding: 1.5rem;
  }

  .house-details, .house-traits {
    margin-bottom: 1rem;
  }

  .grid.grid-cols-1.md\\:grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .grid.grid-cols-1.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .analytics-content {
    padding: 1rem;
  }

  .stat-card {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .analytics-section {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .stat-number {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}
</style>