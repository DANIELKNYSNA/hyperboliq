<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagic, faFeather, faFire, faUser, faLightbulb, faVolumeUp, faVolumeMute, faCake, faWandMagicSparkles, faSprayCanSparkles, faEye } from '@fortawesome/free-solid-svg-icons'
import { useUserStore } from '@/stores/userStore'
import type { SpellInterface } from '@/interfaces/spell'
import { useSpellStore } from '@/stores/spellStore'
import { useUiStore } from '@/stores/uiStore'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import UpdateSpellDialog from '@/components/UpdateSpellDialog.vue'

const uiStore = useUiStore()
const spellStore = useSpellStore()
const selectedSpell = computed<SpellInterface | null>(() => spellStore.selectedSpell)
const router = useRouter()

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)
const loading = ref(true)
const showUpdateDialog = ref(false)

const updatePageName = () => {
  if (selectedSpell.value?.name) {
    const spellName = `Spell: ${selectedSpell.value.name}`
    uiStore.updatePageDisplayName('SpellsDetailsView', spellName)
    document.title = `Spell Details: ${selectedSpell.value.name}`
    if (uiStore.tracker) {
      uiStore.tracker.lastViewedSpell = selectedSpell.value.name || ''
    }
    console.log(`Updated page name to: ${spellName}`)
  }
}

watch(selectedSpell, (newSpell) => {
  if (newSpell?.name) {
    updatePageName()
  }
}, { immediate: true })

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
  updatePageName()
})

function goBack() {
  router.push({name: 'spells'})
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

const getLightIcon = (light: string) => {
  const lightMap: Record<string, IconDefinition> = {
    'Blue': faLightbulb,
    'Green': faLightbulb,
    'Red': faFire,
    'Gold': faSprayCanSparkles,
    'Purple': faWandMagicSparkles,
    'White': faLightbulb
  }
  return lightMap[light] || faLightbulb
}

const getLightColor = (light: string) => {
  const colorMap: Record<string, string> = {
    'Blue': 'text-blue-500',
    'Green': 'text-green-500',
    'Red': 'text-red-500',
    'Gold': 'text-yellow-500',
    'Purple': 'text-purple-500',
    'White': 'text-gray-300'
  }
  return colorMap[light] || 'text-gray-500'
}

function deleteSpell() {
  if (selectedSpell.value && selectedSpell.value.id) {
    spellStore.deleteSpell(selectedSpell.value.id)
    goBack()
  }
}
</script>

<template>
  <div class="spell-detail-page">
    <!-- Background -->
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 spell-background"></div>

    <div class="container mx-auto px-4 py-6 max-w-4xl">
      <!-- Back Button -->
      <div class="mb-6">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Spells"
          @click="goBack"
          severity="secondary"
          outlined
          size="small"
          class="back-button"
        />
      </div>

      <!-- Loading State -->
      <Card v-if="loading" class="spell-card">
        <template #content>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <Skeleton height="3rem" width="60%" />
              <Skeleton height="2rem" width="6rem" />
            </div>
            <Skeleton height="1.5rem" width="40%" />
            <Skeleton height="4rem" />
            <div class="flex gap-3">
              <Skeleton height="2rem" width="5rem" />
              <Skeleton height="2rem" width="5rem" />
            </div>
          </div>
        </template>
      </Card>

      <!-- No Spell Selected -->
      <Card v-else-if="!selectedSpell" class="spell-card">
        <template #content>
          <div class="text-center py-12">
            <FontAwesomeIcon :icon="faEye" class="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">No Spell Selected</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Please go back and select a spell to view its details.
            </p>
            <Button
              icon="pi pi-arrow-left"
              label="Go to Spells"
              @click="goBack"
              severity="info"
              outlined
            />
          </div>
        </template>
      </Card>

      <!-- Spell Details -->
      <Card v-else class="main-container-card">
        <template #content>
          <div class="spell-details-container">
            <!-- Header Card -->
            <Card class="spell-header-card mb-6">
              <template #content>
                <div class="spell-header-content">
                  <!-- Spell Name and Type -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="spell-icon">
                          <FontAwesomeIcon :icon="faMagic" class="text-2xl" />
                        </div>
                        <h1 class="spell-title">{{ selectedSpell.name }}</h1>
                      </div>

                      <!-- Badges Row -->
                      <div class="flex flex-wrap items-center gap-3 mb-4">
                        <Badge
                          :value="selectedSpell.type"
                          :severity="getSpellTypeSeverity(selectedSpell.type)"
                          :class="getSpellTypeClass(selectedSpell.type)"
                          class="spell-type-badge"
                        />

                        <div v-if="selectedSpell.light" class="spell-attribute">
                          <FontAwesomeIcon
                            :icon="getLightIcon(selectedSpell.light)"
                            :class="getLightColor(selectedSpell.light)"
                          />
                          <span>{{ selectedSpell.light }} Light</span>
                        </div>

                        <div class="spell-attribute">
                          <FontAwesomeIcon
                            :icon="selectedSpell.canBeVerbal ? faVolumeUp : faVolumeMute"
                            :class="selectedSpell.canBeVerbal ? 'text-green-500' : 'text-red-500'"
                          />
                          <span>{{ selectedSpell.canBeVerbal ? 'Verbal' : 'Non-verbal' }}</span>
                        </div>
                      </div>
                      <!-- Incantation -->
                      <div v-if="selectedSpell.incantation" class="incantation-section">
                        <div class="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon :icon="faFeather" class="text-purple-500" />
                          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Incantation</span>
                        </div>
                        <div class="incantation-text">
                          "{{ selectedSpell.incantation }}"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Effect Card -->
            <Card class="effect-card mb-6">
              <template #header>
                <div class="card-header">
                  <FontAwesomeIcon :icon="faSprayCanSparkles" />
                  <h2>Magical Effect</h2>
                </div>
              </template>
              <template #content>
                <p class="effect-text">{{ selectedSpell.effect }}</p>
              </template>
            </Card>

            <!-- Creator Card -->
            <Card v-if="selectedSpell.creator" class="creator-card mb-6">
              <template #header>
                <div class="card-header">
                  <FontAwesomeIcon :icon="faUser" />
                  <h2>Creator</h2>
                </div>
              </template>
              <template #content>
                <p class="creator-text">{{ selectedSpell.creator }}</p>
              </template>
            </Card>

            <!-- Admin Actions Card -->
            <Card v-if="isAdmin" class="admin-card">
              <template #header>
                <div class="card-header">
                  <FontAwesomeIcon :icon="faCake" />
                  <h2>Admin Actions</h2>
                </div>
              </template>
              <template #content>
                <div class="flex flex-wrap gap-3">
                  <Button
                    label="Edit Spell"
                    severity="info"
                    outlined
                    @click="showUpdateDialog = true"
                    class="admin-button"
                  />
                  <Button
                    label="Delete Spell"
                    severity="danger"
                    outlined
                    @click="deleteSpell"
                    class="admin-button"
                  />
                </div>
              </template>
            </Card>
          </div>
        </template>
      </Card>
    </div>

    <UpdateSpellDialog v-model:show="showUpdateDialog"/>
  </div>
</template>

<style scoped>
.spell-detail-page {
  min-height: 100vh;
  position: relative;
}

.spell-background {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
  background-attachment: fixed;
}

.container {
  position: relative;
  z-index: 1;
}

/* Back Button */
.back-button {
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-4px);
}

/* Main Container Card */
.main-container-card {
  background: rgba(249, 250, 251, 0.95) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s ease-out;
}

.main-container-card :deep(.p-card-body) {
  background: rgba(249, 250, 251, 0.95) !important;
  border-radius: 20px;
}

.main-container-card :deep(.p-card-content) {
  padding: 20px !important;
  background: rgba(249, 250, 251, 0.95) !important;
  border-radius: 20px;
}

/* Inner Cards */
.spell-card,
.spell-header-card,
.effect-card,
.creator-card,
.admin-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(229, 231, 235, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin: 8px;
}

.spell-card:hover,
.spell-header-card:hover,
.effect-card:hover,
.creator-card:hover,
.admin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.spell-header-card,
.effect-card,
.creator-card,
.admin-card {
  margin-left: 8px;
  margin-right: 8px;
}

/* Card Headers with PrimeVue targeting */
.effect-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin: -1px -1px 0 -1px;
}

.creator-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin: -1px -1px 0 -1px;
}

.admin-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin: -1px -1px 0 -1px;
}

/* Header Card */
.spell-header-card {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.12) 100%);
  border: 1px solid rgba(103, 126, 234, 0.2);
}

.spell-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(103, 126, 234, 0.3);
}

.spell-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

/* Badges and Attributes */
.spell-type-badge {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.spell-attribute {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(103, 126, 234, 0.1);
  color: #374151;
}

/* Incantation */
.incantation-section {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #667eea;
  margin-top: 1rem;
}

.incantation-text {
  font-size: 1.25rem;
  font-weight: 600;
  font-style: italic;
  color: #667eea;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card Headers */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

/* Content */
.effect-text,
.creator-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin: 0;
}

.effect-card {
  border-left: 4px solid #10b981;
}

.creator-card {
  border-left: 4px solid #f59e0b;
}

.admin-card {
  border-left: 4px solid #ef4444;
}

/* Admin Buttons */
.admin-button {
  transition: all 0.3s ease;
}

.admin-button:hover {
  transform: translateY(-2px);
}

/* Spell Type Classes */
.spell-charm {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
}

.spell-curse {
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: white;
  border: none;
}

.spell-jinx {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
}

.spell-hex {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
}

.spell-counter {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
}

.spell-healing {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
}

.spell-default {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: none;
}

/* Dark Mode */
.dark .main-container-card {
  background: rgba(31, 41, 55, 0.95) !important;
  border: 1px solid rgba(75, 85, 99, 0.5);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dark .main-container-card :deep(.p-card-body) {
  background: rgba(31, 41, 55, 0.95) !important;
}

.dark .main-container-card :deep(.p-card-content) {
  background: rgba(31, 41, 55, 0.95) !important;
}

.dark .spell-card,
.dark .spell-header-card,
.dark .effect-card,
.dark .creator-card,
.dark .admin-card {
  background: rgba(55, 65, 81, 0.9);
  border: 1px solid rgba(75, 85, 99, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dark .effect-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.dark .creator-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

.dark .admin-card :deep(.p-card-header) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.dark .spell-header-card {
  background: linear-gradient(135deg, rgba(76, 29, 149, 0.15) 0%, rgba(88, 28, 135, 0.2) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.dark .spell-title {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .spell-attribute {
  background: rgba(55, 65, 81, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: #e5e7eb;
}

.dark .incantation-section {
  background: linear-gradient(135deg, rgba(76, 29, 149, 0.2) 0%, rgba(88, 28, 135, 0.25) 100%);
  border-left-color: #a78bfa;
}

.dark .incantation-text {
  color: #c084fc;
}

.dark .card-header {
  color: #a78bfa;
}

.dark .card-header h2 {
  color: #e5e7eb;
}

.dark .effect-text,
.dark .creator-text {
  color: #d1d5db;
}

.dark .p-button-outlined {
  color: #e7e4e4;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spell-details-container > * {
  animation-delay: 0.1s;
}

.spell-details-container > *:nth-child(2) {
  animation-delay: 0.2s;
}

.spell-details-container > *:nth-child(3) {
  animation-delay: 0.3s;
}

.spell-details-container > *:nth-child(4) {
  animation-delay: 0.4s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .spell-title {
    font-size: 1.5rem;
  }

  .spell-attribute {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }

  .incantation-text {
    font-size: 1rem;
  }

  .card-header {
    color: white;
  }

  .card-header h2 {
    font-size: 1rem;
    color: white;
  }
}

@media (max-width: 640px) {
  .spell-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .spell-title {
    font-size: 1.25rem;
  }

  .admin-button {
    width: 100%;
  }
}
</style>