<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'
import Message from 'primevue/message'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFlask, faMagic, faIndustry, faUser, faLeaf, faFilter, faExclamationTriangle, faClock, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import type { ElixirInterface, IngredientInterface } from '@/interfaces/elixirs'
import { useElixirs } from '@/composables/useElixirs'
import { useElixirStore } from '@/stores/elixirStore'
import { Difficulty } from '@/interfaces/elixirs'
import { useIngredients } from '@/composables/useIngredients';

const { elixirs: elixirsData, isLoading, isError, error, refetch } = useElixirs()
const { ingredients: ingredientsData } = useIngredients()

const loadingMore = ref(false)
const elixirStore = useElixirStore()
const likedElixirs = computed(() => elixirStore.likedElixirs || [])
const selectedElixir = computed(() => elixirStore.selectedElixir)
const showDetailsDialog = ref(false)
const showElixirBrewingDialog = ref(false)
const isCreating = ref(false)

const createInitialElixir = (): Omit<ElixirInterface, 'ingredients'> & { ingredients: string[] } => ({
  id: '',
  name: '',
  effect: '',
  sideEffects: '',
  time: '',
  manufacturer: '',
  ingredients: [],
  inventors: [],
  characteristics: '',
  difficulty: Difficulty.Unknown
})

const newElixir = ref<Omit<ElixirInterface, 'ingredients'> & { ingredients: string[] }>(createInitialElixir())

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

const elixirs = computed(() => {
  if (!elixirsData.value) return []
  if(elixirStore.elixirs) {
    return elixirStore.elixirs as ElixirInterface[]
  }
  return elixirsData.value as ElixirInterface[]
})

const ingredients = computed(() => {
  if (!ingredientsData.value) return []
  return ingredientsData.value as IngredientInterface[]
})

watch(elixirsData, (newElixirs) => {
  if (newElixirs) {
    elixirStore.elixirs = newElixirs as ElixirInterface[]
  }
}, { immediate: true })

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

const isFormValid = computed(() => {
  return newElixir.value.name.trim() &&
         newElixir.value.effect.trim() &&
         newElixir.value.ingredients.length > 0 &&
         newElixir.value.difficulty !== Difficulty.Unknown
})

const isElixirLiked = (elixir: ElixirInterface) => {
  return likedElixirs.value.some(likedElixir => likedElixir.id === elixir.id)
}

const toggleLike = (elixir: ElixirInterface) => {
  if (isElixirLiked(elixir)) {
    const index = likedElixirs.value.findIndex(likedElixir => likedElixir.id === elixir.id)
    if (index > -1) {
      elixirStore.likedElixirs.splice(index, 1)
    }
  } else {
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

const handleRetry = () => {
  refetch()
}

const resetNewElixir = () => {
  newElixir.value = createInitialElixir()
}

const openCreateDialog = () => {
  resetNewElixir()
  showElixirBrewingDialog.value = true
}

const handleCreateElixir = () => {
  if (!isFormValid.value) return
  isCreating.value = true
  try {
    const selectedIngredients = newElixir.value.ingredients
      .map(id => ingredients.value.find(ing => ing.id === id))
      .filter((ing): ing is IngredientInterface => ing !== undefined)
    const elixirToCreate: ElixirInterface = {
      ...newElixir.value,
      id: Date.now().toString(),
      ingredients: selectedIngredients
    }
    elixirStore.createElixir(elixirToCreate)
    showElixirBrewingDialog.value = false
    resetNewElixir()
  } catch (error) {
    console.error('Failed to create elixir:', error)
  } finally {
    isCreating.value = false
  }
}

const cancelCreation = () => {
  showElixirBrewingDialog.value = false
  resetNewElixir()
}
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
          <div class="flex items-center gap-2">
            <Button
              label="Create New Elixir"
              icon="pi pi-plus"
              severity="success"
              @click="openCreateDialog"
              class="create-elixir-btn"
            />
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
              <Dropdown
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
                @click="handleRetry"
                :loading="isLoading"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Error Message -->
    <div v-if="isError" class="mb-4">
      <Message severity="error" class="mb-4">
        <div class="flex items-center justify-between">
          <span>{{ error?.message || 'Failed to load elixirs' }}</span>
          <Button
            label="Try Again"
            icon="fas fa-redo"
            size="small"
            @click="handleRetry"
            class="ml-4"
          />
        </div>
      </Message>
    </div>

    <!-- Results Summary -->
    <div v-if="!isLoading && elixirs.length > 0" class="mb-4">
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
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div v-else-if="!isLoading && paginatedElixirs.length > 0" class="elixirs-grid">
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
    <div v-if="!isLoading && paginatedElixirs.length > 0 && hasMoreToLoad" class="text-center mt-8">
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
    <Card v-else-if="!isLoading && paginatedElixirs.length === 0 && elixirs.length > 0">
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
    <Card v-else-if="!isLoading && elixirs.length === 0 && !isError">
      <template #content>
        <div class="text-center py-8">
          <FontAwesomeIcon :icon="faFlask" class="text-6xl text-gray-300 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No elixirs available</h3>
          <p class="mb-4">There are currently no elixirs in the system</p>
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            @click="handleRetry"
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

    <Dialog
      v-model:visible="showElixirBrewingDialog"
      modal
      header="Create New Elixir"
      :style="{ width: '50vw', minWidth: '350px', maxWidth: '800px' }"
      class="elixir-brewing-dialog"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <FontAwesomeIcon :icon="faFlask" class="text-2xl text-green-600" />
          <div class="flex-1">
            <h3 class="text-xl font-bold">Brew a New Elixir</h3>
            <p class="text-sm text-gray-600 mt-1">Create your magical potion</p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <div class="field">
          <label for="elixirName" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faFlask" class="mr-1 text-purple-600" />
            Elixir Name *
          </label>
          <InputText
            id="elixirName"
            v-model="newElixir.name"
            placeholder="Enter elixir name..."
            class="w-full"
            :disabled="isCreating"
            :class="{ 'p-invalid': !newElixir.name.trim() && newElixir.name !== '' }"
          />
        </div>

        <div class="field">
          <label for="elixirIngredients" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faLeaf" class="mr-1 text-green-600" />
            Ingredients * ({{ newElixir.ingredients.length }} selected)
          </label>
          <MultiSelect
            id="elixirIngredients"
            v-model="newElixir.ingredients"
            :options="ingredients"
            optionLabel="name"
            optionValue="id"
            filter
            placeholder="Select ingredients..."
            :maxSelectedLabels="3"
            class="w-full"
            :disabled="isCreating"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <FontAwesomeIcon :icon="faLeaf" class="text-green-600 text-sm" />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </div>

        <div class="field">
          <label for="elixirEffect" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faMagic" class="mr-1 text-purple-600" />
            Primary Effect *
          </label>
          <InputText
            id="elixirEffect"
            v-model="newElixir.effect"
            placeholder="Describe the primary magical effect..."
            class="w-full"
            :disabled="isCreating"
            :class="{ 'p-invalid': !newElixir.effect.trim() && newElixir.effect !== '' }"
          />
        </div>

        <div class="field">
          <label for="elixirDifficulty" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faExclamationTriangle" class="mr-1 text-orange-600" />
            Difficulty Level *
          </label>
          <Dropdown
            id="elixirDifficulty"
            v-model="newElixir.difficulty"
            :options="difficultyOptions.filter(opt => opt.value !== '')"
            optionLabel="label"
            optionValue="value"
            placeholder="Select difficulty level..."
            class="w-full"
            :disabled="isCreating"
            :class="{ 'p-invalid': newElixir.difficulty === Difficulty.Unknown }"
          />
        </div>

        <div class="field">
          <label for="elixirTime" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faClock" class="mr-1 text-blue-600" />
            Brewing Time
          </label>
          <InputText
            id="elixirTime"
            v-model="newElixir.time"
            placeholder="e.g., 30 minutes, 2 hours..."
            class="w-full"
            :disabled="isCreating"
          />
        </div>

        <div class="field">
          <label for="elixirSideEffects" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faExclamationTriangle" class="mr-1 text-orange-600" />
            Side Effects
          </label>
          <InputText
            id="elixirSideEffects"
            v-model="newElixir.sideEffects"
            placeholder="Describe any side effects..."
            class="w-full"
            :disabled="isCreating"
          />
        </div>

        <div class="field">
          <label for="elixirManufacturer" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faIndustry" class="mr-1 text-gray-600" />
            Manufacturer
          </label>
          <InputText
            id="elixirManufacturer"
            v-model="newElixir.manufacturer"
            placeholder="Enter manufacturer name..."
            class="w-full"
            :disabled="isCreating"
          />
        </div>

        <div class="field">
          <label for="elixirCharacteristics" class="block text-sm font-medium mb-2">
            <FontAwesomeIcon :icon="faMagic" class="mr-1 text-indigo-600" />
            Characteristics
          </label>
          <InputText
            id="elixirCharacteristics"
            v-model="newElixir.characteristics"
            placeholder="Describe special characteristics..."
            class="w-full"
            :disabled="isCreating"
          />
        </div>

        <!-- Form Validation Summary -->
        <div v-if="!isFormValid" class="mt-4">
          <Message severity="warn" :closable="false">
            <div class="text-sm">
              <p class="font-medium mb-2">Please complete the following required fields:</p>
              <ul class="list-disc list-inside space-y-1">
                <li v-if="!newElixir.name.trim()">Elixir Name</li>
                <li v-if="newElixir.ingredients.length === 0">At least one ingredient</li>
                <li v-if="!newElixir.effect.trim()">Primary Effect</li>
                <li v-if="newElixir.difficulty === Difficulty.Unknown">Difficulty Level</li>
              </ul>
            </div>
          </Message>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600 mr-2">
            <FontAwesomeIcon :icon="faFlask" class="mr-1" />
            Fields marked with * are required
          </div>
          <div class="flex gap-3">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="cancelCreation"
              :disabled="isCreating"
            />
            <Button
              label="Brew Elixir"
              icon="pi pi-check"
              severity="success"
              :loading="isCreating"
              :disabled="!isFormValid"
              @click="handleCreateElixir"
              class="brew-btn"
            />
          </div>
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

.create-elixir-btn {
  transition: all 0.3s ease;
}

.create-elixir-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.brew-btn:not(:disabled) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  transition: all 0.3s ease;
}

.brew-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
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

.elixir-brewing-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.elixir-brewing-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.elixir-brewing-dialog :deep(.p-dialog-footer) {
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

.field {
  margin-bottom: 1rem;
}

.field label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

:deep(.p-invalid) {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.2) !important;
}

/* MultiSelect custom styling */
:deep(.p-multiselect-panel .p-multiselect-item) {
  padding: 0.75rem;
}

:deep(.p-multiselect-panel .p-multiselect-item:hover) {
  background: rgba(16, 185, 129, 0.1);
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

  .elixir-details-dialog,
  .elixir-brewing-dialog {
    width: 95vw !important;
    min-width: unset !important;
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

.dark #difficultyFilter {
  background-color: rgb(44, 43, 43) !important;
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