<script setup lang="ts">
import { ref, reactive, onMounted, computed, inject } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Autocomplete from 'primevue/autocomplete'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'
import Message from 'primevue/message'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFlask, faMagic, faIndustry, faUser, faLeaf, faFilter, faExclamationTriangle, faClock, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import type { ApiClientsImpl } from '@/Api/ApiClients'
import type { ElixirInterface } from '@/interfaces/elixirs'
import { useElixirStore } from '@/stores/elixirStore'

library.add(faFlask, faMagic, faIndustry, faUser, faLeaf, faFilter, faExclamationTriangle, faClock, faHeart, faHeartBroken)

const apiClients = inject<ApiClientsImpl>('apiClients')
const loading = ref(false)
const loadingMore = ref(false)
const fetchError = ref<string | null>(null)
const elixirStore = useElixirStore()
const elixirs = computed(() => elixirStore.elixirs || [])
const likedElixirs = computed(() => elixirStore.likedElixirs || [])
const selectedElixir = computed(() => elixirStore.selectedElixir)
const showDetailsDialog = ref(false)

// Lazy loading state
const ITEMS_PER_PAGE = 12
const currentPage = ref(1)

const globalFilters = reactive({
  nameFilter: '',
  difficultyFilter: '',
})

const difficultyOptions = [
  { label: 'All Difficulties', value: '' },
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Expert', value: 'Expert' },
]

const filteredElixirs = computed(() => {
  if (!elixirs.value) return []

  return elixirs.value.filter((elixir) => {
    const nameMatch = elixir.name.toLowerCase().includes(globalFilters.nameFilter.toLowerCase())
    const difficultyMatch = !globalFilters.difficultyFilter || elixir.difficulty === globalFilters.difficultyFilter
    return nameMatch && difficultyMatch
  })
})

const paginatedElixirs = computed(() => {
  const totalItems = currentPage.value * ITEMS_PER_PAGE
  return filteredElixirs.value.slice(0, totalItems)
})

const hasMoreToLoad = computed(() => {
  return paginatedElixirs.value.length < filteredElixirs.value.length
})

const isElixirLiked = (elixir: ElixirInterface) => {
  return likedElixirs.value.some(likedElixir => likedElixir.id === elixir.id)
}

const toggleLike = (elixir: ElixirInterface) => {
  if (isElixirLiked(elixir)) {
    // Remove from liked elixirs
    const index = likedElixirs.value.findIndex(likedElixir => likedElixir.id === elixir.id)
    if (index > -1) {
      elixirStore.likedElixirs.splice(index, 1)
    }
  } else {
    // Add to liked elixirs
    if (!elixirStore.likedElixirs) {
      elixirStore.likedElixirs = []
    }
    elixirStore.likedElixirs.push(elixir)
  }
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

const fetchElixirs = async () => {
  loading.value = true
  fetchError.value = null
  currentPage.value = 1

  if (!apiClients) {
    fetchError.value = 'API client not available'
    loading.value = false
    return
  }
  try {
    const response = await apiClients.serviceElixirsClient.getElixirs()
    if (response && response.data) {
      elixirStore.elixirs = response.data as ElixirInterface[]
    } else {
      fetchError.value = 'No elixirs found'
    }
  } catch (error) {
    fetchError.value = 'Failed to fetch elixirs'
    console.error('Error fetching elixirs:', error)
  } finally {
    loading.value = false
  }
}

const loadMoreElixirs = async () => {
  if (loadingMore.value || !hasMoreToLoad.value) return

  loadingMore.value = true

  // Simulate loading delay for better UX
  await new Promise(resolve => setTimeout(resolve, 500))

  currentPage.value += 1
  loadingMore.value = false
}

const selectElixir = (elixir: ElixirInterface) => {
  elixirStore.selectedElixir = elixir
  showDetailsDialog.value = true
}

const deleteElixir = async (id: string) => {
  elixirStore.deleteElixir(id)
  elixirStore.selectedElixir = null
}

const clearFilters = () => {
  globalFilters.nameFilter = ''
  globalFilters.difficultyFilter = ''
  currentPage.value = 1
}

const hasActiveFilters = computed(() => {
  return globalFilters.nameFilter || globalFilters.difficultyFilter
})

const resetPaginationOnFilterChange = () => {
  currentPage.value = 1
}

const watchFilters = () => {
  resetPaginationOnFilterChange()
}

onMounted(() => {
  document.title = 'Magical Elixirs'
  if (!elixirs.value || elixirs.value.length === 0) {
    fetchElixirs()
  }
})
</script>

<template>
  <div class="elixirs-page">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 elixir-background"></div>
    <!-- Header Card -->
    <Card class="mb-6">
      <template #title>
        <div class="flex items-center gap-3">
          <FontAwesomeIcon :icon="faFlask" class="text-3xl text-purple-600" />
          <h3>Magical Elixirs</h3>
          <Badge v-if="likedElixirs.length > 0" :value="`${likedElixirs.length} liked`" severity="danger" class="ml-auto">
            <FontAwesomeIcon :icon="faHeart" class="mr-1 text-xs" />
            {{ likedElixirs.length }}
          </Badge>
        </div>
      </template>
      <template #subtitle>
        <div class="flex items-center justify-between">
          <p>Discover and explore magical potions and elixirs</p>
          <div v-if="hasActiveFilters" class="flex items-center gap-2">
            <Badge value="Filtered" severity="info" />
            <Button
              label="Clear Filters"
              size="small"
              severity="secondary"
              outlined
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
      <template #content>
        <!-- Filters -->
        <div class="filter-container">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="field">
              <label for="nameFilter" class="block text-sm font-medium mb-2">
                <FontAwesomeIcon :icon="faFilter" class="mr-1" />
                Search by Name
              </label>
              <InputText
                id="nameFilter"
                v-model="globalFilters.nameFilter"
                placeholder="Enter elixir name..."
                class="w-full"
                @input="watchFilters"
              />
            </div>
            <div class="field">
              <label for="difficultyFilter" class="block text-sm font-medium mb-2">
                Filter by Difficulty
              </label>
              <Autocomplete
                id="difficultyFilter"
                v-model="globalFilters.difficultyFilter"
                :options="difficultyOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select difficulty"
                class="w-full"
                @change="watchFilters"
              />
            </div>
            <div class="field">
              <Button
                label="Refresh"
                @click="fetchElixirs"
                :loading="loading"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
    <!-- Error Message -->
    <Message v-if="fetchError" severity="error" class="mb-4">
      {{ fetchError }}
    </Message>
    <!-- Results Summary -->
    <div v-if="!loading && elixirs.length > 0" class="mb-4">
      <p class="show_text">
        Showing {{ paginatedElixirs.length }} of {{ filteredElixirs.length }} elixirs
        <span v-if="filteredElixirs.length !== elixirs.length" class="font-medium text-purple-600">
          ({{ elixirs.length }} total)
        </span>
        <span v-if="hasActiveFilters" class="font-medium text-purple-600">
          (filtered)
        </span>
      </p>
    </div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="n in 6" :key="n" class="elixir-card">
        <template #content>
          <div class="space-y-4">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="3rem" />
            <div class="flex gap-2">
              <Skeleton height="2rem" width="4rem" />
              <Skeleton height="2rem" width="4rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <!-- Elixirs Grid -->
    <div v-else-if="!loading && paginatedElixirs.length > 0" class="elixirs-grid">
      <Card
        v-for="elixir in paginatedElixirs"
        :key="elixir.id"
        class="elixir-card"
      >
        <template #content>
          <div class="elixir-content">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold">{{ elixir.name }}</h3>
                  <FontAwesomeIcon
                    v-if="isElixirLiked(elixir)"
                    :icon="faHeart"
                    class="text-red-500 text-sm animate-pulse"
                  />
                </div>
                <Badge
                  :value="elixir.difficulty"
                  :severity="getDifficultySeverity(elixir.difficulty)"
                  class="mb-2"
                />
              </div>
              <div class="flex items-center gap-2">
                <Button
                  @click="toggleLike(elixir)"
                  size="small"
                  :severity="isElixirLiked(elixir) ? 'danger' : 'secondary'"
                  :outlined="!isElixirLiked(elixir)"
                  class="like-btn"
                >
                  <FontAwesomeIcon :icon="isElixirLiked(elixir) ? faHeart : faHeartBroken" />
                </Button>
                <FontAwesomeIcon :icon="faMagic" class="text-purple-500 text-xl" />
              </div>
            </div>
            <div class="mb-4">
              <p>{{ elixir.effect }}</p>
            </div>
            <div v-if="elixir.sideEffects" class="mb-4">
              <span class="colored_text text-xs font-semibold text-orange-600 uppercase tracking-wide">Side Effects</span>
              <p class="colored_text text-sm text-orange-700 mt-1">{{ elixir.sideEffects }}</p>
            </div>
            <div class="mb-4 space-y-1">
              <div v-if="elixir.time" class="text-sm">
                <strong>Brewing Time:</strong> {{ elixir.time }}
              </div>
              <div v-if="elixir.manufacturer" class="text-sm">
                <strong>Manufacturer:</strong> {{ elixir.manufacturer }}
              </div>
            </div>
            <div v-if="elixir.ingredients && elixir.ingredients.length > 0" class="mb-4">
              <Badge
                :value="`${elixir.ingredients.length} Ingredients`"
                severity="info"
                class="text-xs"
              />
            </div>
            <div class="action-buttons">
              <Button
                label="View Details"
                severity="info"
                outlined
                size="small"
                @click="selectElixir(elixir)"
                class="flex-1"
              />
              <Button
                label="Delete Elixir"
                severity="danger"
                outlined
                size="small"
                @click="deleteElixir(elixir.id)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Load More Button -->
    <div v-if="!loading && paginatedElixirs.length > 0 && hasMoreToLoad" class="text-center mt-8">
      <Button
        label="Load More Elixirs"
        icon="pi pi-chevron-down"
        severity="info"
        outlined
        size="large"
        :loading="loadingMore"
        @click="loadMoreElixirs"
        class="load-more-btn"
      />
      <p class="load_more text-sm mt-2">
        {{ filteredElixirs.length - paginatedElixirs.length }} more elixirs available
      </p>
    </div>

    <!-- Loading More Skeletons -->
    <div v-if="loadingMore" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <Card v-for="n in Math.min(ITEMS_PER_PAGE, filteredElixirs.length - paginatedElixirs.length)" :key="`loading-${n}`" class="elixir-card">
        <template #content>
          <div class="space-y-4">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="3rem" />
            <div class="flex gap-2">
              <Skeleton height="2rem" width="4rem" />
              <Skeleton height="2rem" width="4rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- No Results -->
    <Card v-else-if="!loading && paginatedElixirs.length === 0 && elixirs.length > 0">
      <template #content>
        <div class="text-center py-8">
          <FontAwesomeIcon :icon="faFlask" class="text-6xl text-gray-300 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No elixirs found</h3>
          <p class="mb-4">Try adjusting your search criteria</p>
          <Button
            label="Clear Filters"
            severity="secondary"
            outlined
            @click="clearFilters"
            v-if="hasActiveFilters"
          />
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-else-if="!loading && elixirs.length === 0">
      <template #content>
        <div class="text-center py-8">
          <FontAwesomeIcon :icon="faFlask" class="text-6xl text-gray-300 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No elixirs available</h3>
          <p class="mb-4">There are currently no elixirs in the system</p>
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            @click="fetchElixirs"
          />
        </div>
      </template>
    </Card>

    <!-- Elixir Details Dialog -->
    <Dialog
      v-model:visible="showDetailsDialog"
      modal
      header="Elixir Details"
      :style="{ width: '50vw', minWidth: '350px', maxWidth: '800px' }"
      class="elixir-details-dialog"
    >
      <template #header>
        <div v-if="selectedElixir" class="flex items-center gap-3">
          <FontAwesomeIcon :icon="faFlask" class="text-2xl text-purple-600" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-bold">{{ selectedElixir.name }}</h3>
            </div>
            <Badge
              :value="selectedElixir.difficulty"
              :severity="getDifficultySeverity(selectedElixir.difficulty)"
              class="mt-1"
            />
          </div>
          <Button
            @click="toggleLike(selectedElixir)"
            size="small"
            :severity="isElixirLiked(selectedElixir) ? 'danger' : 'secondary'"
            :outlined="!isElixirLiked(selectedElixir)"
            class="like-btn-dialog"
          >
            <FontAwesomeIcon :icon="isElixirLiked(selectedElixir) ? faHeart : faHeartBroken" />
          </Button>
        </div>
      </template>

      <div v-if="selectedElixir" class="space-y-6">
        <div class="effect-section">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon :icon="faMagic" class="text-purple-600" />
            Primary Effect
          </h3>
          <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
            <p class="leading-relaxed">{{ selectedElixir.effect }}</p>
          </div>
        </div>
        <div v-if="selectedElixir.sideEffects" class="side-effects-section">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon :icon="faExclamationTriangle" class="text-orange-600" />
            Side Effects
          </h3>
          <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
            <p class="leading-relaxed">{{ selectedElixir.sideEffects }}</p>
          </div>
        </div>
        <div v-if="selectedElixir.characteristics" class="characteristics-section">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon :icon="faMagic" class="text-blue-600" />
            Characteristics
          </h3>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p class="text-gray-800 leading-relaxed">{{ selectedElixir.characteristics }}</p>
          </div>
        </div>
        <Divider />
        <div class="details-grid">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="selectedElixir.time" class="detail-item">
              <div class="flex items-center gap-2 mb-2">
                <FontAwesomeIcon :icon="faClock" class="text-green-600" />
                <h4 class="font-semibold text-gray-800">Brewing Time</h4>
              </div>
              <p class="text-gray-700 pl-6">{{ selectedElixir.time }}</p>
            </div>
            <div v-if="selectedElixir.manufacturer" class="detail-item">
              <div class="flex items-center gap-2 mb-2">
                <FontAwesomeIcon :icon="faIndustry" class="text-blue-600" />
                <h4 class="font-semibold text-gray-800">Manufacturer</h4>
              </div>
              <p class="text-gray-700 pl-6">{{ selectedElixir.manufacturer }}</p>
            </div>
          </div>
        </div>
        <div v-if="selectedElixir.inventors && selectedElixir.inventors.length > 0" class="inventors-section">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon :icon="faUser" class="text-indigo-600" />
            Inventors
          </h3>
          <div class="flex flex-wrap gap-2">
            <Chip
              v-for="inventor in selectedElixir.inventors"
              :key="inventor.id"
              :label="`${inventor.firstName} ${inventor.lastName}`"
              class="bg-indigo-100 text-indigo-800"
            />
          </div>
        </div>
        <div v-if="selectedElixir.ingredients && selectedElixir.ingredients.length > 0" class="ingredients-section">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon :icon="faLeaf" class="text-green-600" />
            Ingredients
            <Badge :value="selectedElixir.ingredients.length" severity="success" />
          </h3>
          <div class="ingredients-grid">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="ingredient in selectedElixir.ingredients"
                :key="ingredient.id"
                class="ingredient-card"
              >
                <div class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FontAwesomeIcon :icon="faLeaf" class="text-green-600 text-sm" />
                  <span class="text-gray-800 font-medium">{{ ingredient.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Close"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="showDetailsDialog = false"
          />
          <Button
            label="Delete Elixir"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="deleteElixir(selectedElixir?.id || ''); showDetailsDialog = false"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.elixirs-page {
  padding: 1rem;
}

.elixir-background {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
  background-attachment: fixed;
}

.filter-container {
  background: rgba(103, 126, 234, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.elixirs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.elixir-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.elixir-card :deep(.p-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.elixir-card :deep(.p-card-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.elixir-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.elixir-content {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.elixir-content .action-buttons {
  margin-top: auto;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.field label {
  color: #374151;
  font-weight: 500;
}

.load-more-btn {
  min-width: 200px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Like button styles */
.like-btn, .like-btn-dialog {
  transition: all 0.3s ease;
}

.like-btn:hover, .like-btn-dialog:hover {
  transform: scale(1.1);
}

.like-btn.p-button-danger:not(.p-button-outlined),
.like-btn-dialog.p-button-danger:not(.p-button-outlined) {
  animation: heartbeat 0.6s ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Elixir Details Dialog Styles */
.elixir-details-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.elixir-details-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.elixir-details-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.effect-section,
.side-effects-section,
.characteristics-section {
  margin-bottom: 1rem;
}

.detail-item {
  background: rgba(103, 126, 234, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #667eea;
}

.inventors-section .p-chip {
  font-size: 0.875rem;
}

.ingredients-grid .ingredient-card {
  transition: all 0.2s ease;
}

.ingredients-grid .ingredient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .elixirs-page {
    padding: 0.5rem;
  }

  .elixirs-grid {
    grid-template-columns: 1fr;
  }

  .filter-container {
    padding: 1rem;
  }

  .filter-container .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-buttons .p-button {
    width: 100%;
  }
}

.show_text {
  color: rgb(233, 233, 234);
  font-weight: 500;
}

.dark span {
  color: rgb(44, 43, 43) !important;
}

.dark label, .dark h3 {
  color: rgb(232, 230, 230) !important;
}

.dark .leading-relaxed {
  color: rgb(36, 36, 36) !important;
}

.dark .colored_text {
  color: rgb(230, 224, 224) !important;
}

.dark .p-button-outlined.p-button-secondary {
  color: rgb(223, 223, 223) !important;
  background-color: rgb(130, 130, 130);
}

.load_more {
  color: rgb(223, 223, 223) !important;
}

/* Pulse animation for liked elixirs indicator */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>