<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import { useRouter } from 'vue-router'
import type { SpellInterface } from '@/interfaces/spell'
import type { ApiClientsImpl } from '@/Api/ApiClients'
import { useSpellStore } from '@/stores/spellStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faMagic, faUserTie, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'

 library.add(
  faMagic,
  faUserTie,
  faSearch,
  faHeart,
  faHeartBroken
)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUserStore } from '@/stores/userStore'
import UpdateSpellDialog from '@/components/UpdateSpellDialog.vue'

const router = useRouter()
const apiClients = inject<ApiClientsImpl>('apiClients')
const loading = ref(false)
const fetchError = ref<string | null>(null)
const spellStore = useSpellStore()
const showUpdateDialog = ref(false)
const updateError = ref<string | null>(null)

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

const globalFilterValue = ref('')
const filters = ref({
  global: { value: null as string | null, matchMode: 'contains' },
  name: { value: null as string | null, matchMode: 'contains' },
  type: { value: null as string | null, matchMode: 'equals' },
  effect: { value: null as string | null, matchMode: 'contains' }
})

const updateForm = ref({
  id: '',
  name: '',
  effect: '',
  incantation: '',
  type: ''
})

const spells = computed(() => spellStore.spells)
const likedSpells = computed(() => spellStore.likedSpells || [])

const filteredSpells = computed(() => {
  if (!spells.value) return []
  let filtered = [...spells.value]
  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase()
    filtered = filtered.filter(spell =>
      spell.name.toLowerCase().includes(searchTerm) ||
      spell.effect.toLowerCase().includes(searchTerm) ||
      spell.type.toLowerCase().includes(searchTerm) ||
      (spell.incantation && spell.incantation.toLowerCase().includes(searchTerm))
    )
  }
  if (filters.value.type.value) {
    filtered = filtered.filter(spell => spell.type === filters.value.type.value)
  }
  return filtered
})

const spellTypes = computed(() => {
  const types = [...new Set((spells?.value || []).map(spell => spell.type))]
  return types.map(type => ({ label: type, value: type }))
})

const isSpellLiked = (spell: SpellInterface) => {
  return likedSpells.value.some(likedSpell => likedSpell.id === spell.id)
}

const toggleLike = (spell: SpellInterface) => {
  if (isSpellLiked(spell)) {
    // Remove from liked spells
    const index = likedSpells.value.findIndex(likedSpell => likedSpell.id === spell.id)
    if (index > -1) {
      spellStore.likedSpells.splice(index, 1)
    }
  } else {
    // Add to liked spells
    if (!spellStore.likedSpells) {
      spellStore.likedSpells = []
    }
    spellStore.likedSpells.push(spell)
  }
}

const fetchSpells = async () => {
  loading.value = true
  fetchError.value = null
  if (!apiClients) {
    fetchError.value = 'API client not available'
    loading.value = false
    return
  }
  try {
    const response = await apiClients.serviceSpellsClient.getSpells()
    if (response && response.data) {
      spellStore.spells = response.data
    }
  } catch (err) {
    fetchError.value = 'Failed to fetch spells'
    console.error('Error fetching spells:', err)
  } finally {
    loading.value = false
  }
}

const clearFilter = () => {
  globalFilterValue.value = ''
  filters.value.global.value = null
  filters.value.name.value = null
  filters.value.type.value = null
  filters.value.effect.value = null
}

const onGlobalFilterChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  filters.value.global.value = target.value
}

const getSpellTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    'Charm': 'spell-charm',
    'Curse': 'spell-curse',
    'Jinx': 'spell-jinx',
    'Hex': 'spell-hex',
    'Counter-spell': 'spell-counter',
    'Healing spell': 'spell-healing'
  }
  return typeMap[type] || 'spell-default'
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

const viewSpellDetails = (spell: SpellInterface) => {
  spellStore.selectedSpell = spell
  router.push(`/spells/${spell.id}`)
}

const updateSpell = (spell: SpellInterface) => {
  spellStore.selectedSpell = spell
  updateForm.value = {
    id: spell.id || '',
    name: spell.name,
    effect: spell.effect,
    incantation: spell.incantation || '',
    type: spell.type
  }
  updateError.value = null
  showUpdateDialog.value = true
}

onMounted(() => {
  if (!spells.value || spells.value.length === 0) {
    fetchSpells()
  }
})
</script>

<template>
  <div class="spells-page">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 spells-background"></div>
    <div class="container mx-auto px-4 py-6">
      <Card class="spells-card">
        <template #title>
          <div class="flex items-center gap-3">
            <FontAwesomeIcon :icon="faMagic" class="text-2xl text-purple-600" />
            <span class="text-2xl font-bold">Spells Compendium</span>
            <Badge :value="filteredSpells?.length" class="ml-auto" severity="info" />
            <Badge v-if="likedSpells.length > 0" :value="`${likedSpells.length} liked`" severity="danger" class="ml-2">
              <FontAwesomeIcon :icon="faHeart" class="mr-1 text-xs" />
              {{ likedSpells.length }}
            </Badge>
          </div>
        </template>
        <template #content>
          <div class="mb-6">
            <p class="mb-4">
              Discover and explore the vast collection of magical spells from the wizarding world.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="search-container">
                <span class="p-input-icon-left w-full">
                  <InputText
                    v-model="globalFilterValue"
                    @input="onGlobalFilterChange"
                    placeholder="Search spells..."
                    class="w-full"
                  />
                </span>
              </div>
              <div class="filter-container">
                <Dropdown
                  v-model="filters.type.value"
                  :options="spellTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Filter by Type"
                  class="w-full"
                  :showClear="true"
                />
              </div>
              <div class="actions-container">
                <Button
                  label="Clear Filters"
                  icon="pi pi-filter-slash"
                  @click="clearFilter"
                  class="w-full"
                  severity="secondary"
                  outlined
                />
              </div>
            </div>

            <!-- Error Message -->
            <Message v-if="fetchError" severity="error" class="mb-4">
              {{ fetchError }}
            </Message>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
              <div class="grid grid-cols-1 gap-4">
                <Skeleton height="3rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem"></Skeleton>
              </div>
            </div>

            <!-- Desktop Data Table (hidden on medium and smaller screens) -->
            <div v-if="!loading" class="hidden lg:block">
              <DataTable
                :value="spells"
                v-model:filters="filters"
                :globalFilterFields="['name', 'effect', 'type']"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 50rem"
                stripedRows
                removableSort
                :loading="loading"
                class="spell-table"
                responsiveLayout="scroll"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} spells"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              >
                <template #empty>
                  <div class="text-center py-8">
                    <FontAwesomeIcon :icon="faSearch" class="text-4xl text-gray-400 mb-4" />
                    <p class="text-lg">No spells found matching your criteria.</p>
                  </div>
                </template>

                <Column field="name" header="Spell Name" sortable class="spell-name-column">
                  <template #body="slotProps">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold">{{ slotProps.data.name }}</span>
                      <FontAwesomeIcon
                        v-if="isSpellLiked(slotProps.data)"
                        :icon="faHeart"
                        class="text-red-500 text-sm"
                      />
                    </div>
                  </template>
                </Column>

                <Column field="effect" header="Effect" sortable class="spell-effect-column">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.effect }}</span>
                  </template>
                </Column>

                <Column field="incantation" header="Incantation" sortable class="spell-name-column">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.incantation }}</span>
                  </template>
                </Column>

                <Column field="type" header="Type" sortable class="spell-type-column">
                  <template #body="slotProps">
                    <Badge
                      :value="slotProps.data.type"
                      :severity="getSpellTypeSeverity(slotProps.data.type)"
                      :class="getSpellTypeClass(slotProps.data.type)"
                    />
                  </template>
                </Column>

                <Column header="Actions" class="actions-column">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button
                        @click="toggleLike(slotProps.data)"
                        size="small"
                        :severity="isSpellLiked(slotProps.data) ? 'danger' : 'secondary'"
                        :outlined="!isSpellLiked(slotProps.data)"
                        class="like-btn"
                      >
                        <FontAwesomeIcon :icon="isSpellLiked(slotProps.data) ? faHeart : faHeartBroken" />
                      </Button>
                      <Button
                        label="View"
                        @click="viewSpellDetails(slotProps.data)"
                        size="small"
                        outlined
                      />
                      <template v-if="isAdmin">
                        <Button
                          label="Update"
                          @click="updateSpell(slotProps.data)"
                          size="small"
                          severity="secondary"
                          outlined
                        />
                      </template>
                    </div>
                  </template>
                </Column>
              </DataTable>
            </div>

            <!-- Mobile/Tablet Card View (shown on medium and smaller screens) -->
            <div v-if="!loading" class="lg:hidden">
              <div v-if="filteredSpells.length === 0" class="text-center py-8">
                <FontAwesomeIcon :icon="faSearch" class="text-4xl text-gray-400 mb-4" />
                <p class="text-lg">No spells found matching your criteria.</p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card v-for="spell in filteredSpells" :key="spell.id" class="spell-card">
                  <template #header>
                    <div class="flex items-center justify-between p-4 pb-2">
                      <div class="flex items-center gap-2">
                        <h3 class="font-bold text-lg">{{ spell.name }}</h3>
                      </div>
                      <div class="flex items-center gap-2">
                        <Button
                          @click="toggleLike(spell)"
                          size="small"
                          :severity="isSpellLiked(spell) ? 'danger' : 'secondary'"
                          :outlined="!isSpellLiked(spell)"
                          class="like-btn-mobile"
                        >
                          <FontAwesomeIcon :icon="isSpellLiked(spell) ? faHeart : faHeartBroken" />
                        </Button>
                        <Badge
                          :value="spell.type"
                          :severity="getSpellTypeSeverity(spell.type)"
                          :class="getSpellTypeClass(spell.type)"
                        />
                      </div>
                    </div>
                  </template>

                  <template #content>
                    <div class="space-y-3">
                      <div v-if="spell.incantation">
                        <p class="text-sm font-semibold">Incantation:</p>
                        <p class="text-sm italic">"{{ spell.incantation }}"</p>
                      </div>

                      <div>
                        <p class="text-sm font-semibold">Effect:</p>
                        <p class="text-sm">{{ spell.effect }}</p>
                      </div>
                    </div>
                  </template>

                  <template #footer>
                    <div class="flex gap-2 justify-end">
                      <Button
                        icon="pi pi-eye"
                        label="View"
                        @click="viewSpellDetails(spell)"
                        size="small"
                        outlined
                      />
                      <template v-if="isAdmin">
                        <Button
                          icon="pi pi-pencil"
                          label="Update"
                          @click="updateSpell(spell)"
                          size="small"
                          severity="secondary"
                          outlined
                        />
                      </template>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <UpdateSpellDialog v-model:show="showUpdateDialog"/>
  </div>
</template>

<style scoped>
.spells-page {
  min-height: 100vh;
  position: relative;
}

.spells-background {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
  background-attachment: fixed;
}

.container {
  position: relative;
  z-index: 1;
}

.spell-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.spell-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.search-container .p-input-icon-left > .p-inputtext {
  padding-left: 2.5rem;
}

.spell-table {
  border-radius: 8px;
  overflow: hidden;
}

.spell-table :deep(.p-datatable-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.spell-table :deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-weight: 600;
}

.spell-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: rgba(103, 126, 234, 0.1);
}

.dark .spell-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: rgb(233, 233, 236);
}

.dark .p-button-outlined.p-button-secondary,
.dark .p-button-outlined{
  background: rgb(207, 206, 206) !important;
}

.dark .p-button-outlined.p-button-secondary:hover,
.dark .p-button-outlined:hover {
  background: rgb(243, 242, 242) !important;
}

.spell-name-column {
  min-width: 200px;
}

.spell-effect-column {
  min-width: 300px;
}

.spell-type-column {
  min-width: 120px;
}

.actions-column {
  min-width: 220px;
}

/* Like button styles */
.like-btn, .like-btn-mobile {
  transition: all 0.3s ease;
}

.like-btn:hover, .like-btn-mobile:hover {
  transform: scale(1.1);
}

.like-btn.p-button-danger:not(.p-button-outlined),
.like-btn-mobile.p-button-danger:not(.p-button-outlined) {
  animation: heartbeat 0.6s ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Spell type specific styles */
.spell-charm {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
}

.spell-curse {
  background: linear-gradient(135deg, #fd79a8, #e84393);
}

.spell-jinx {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
}

.spell-hex {
  background: linear-gradient(135deg, #fd79a8, #6c5ce7);
}

.spell-counter {
  background: linear-gradient(135deg, #00b894, #00cec9);
}

.spell-healing {
  background: linear-gradient(135deg, #55a3ff, #a29bfe);
}

.spell-default {
  background: linear-gradient(135deg, #636e72, #2d3436);
  color: white;
}

.loading-container {
  padding: 2rem;
}

/* Animation for smooth transitions */
.spell-table :deep(.p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

.spells-card {
  animation: fadeInUp 0.6s ease-out;
}

.spell-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive breakpoints */
@media (max-width: 1023px) {
  .spell-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .update-spell-dialog {
    width: 95vw !important;
    max-width: 95vw !important;
  }

  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .actions-column {
    min-width: 200px;
  }
}

/* Pulse animation for liked spells indicator */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>