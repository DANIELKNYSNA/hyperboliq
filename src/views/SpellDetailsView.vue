<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagic, faFeather, faFire, faUser, faLightbulb, faVolumeUp, faVolumeMute, faCake, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
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

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)

  document.title = `Spell Details: ${selectedSpell.value?.name || 'Unknown'}`
  if (uiStore.tracker) {
    uiStore.tracker.lastViewedSpell = selectedSpell.value?.id || ''
  }
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
    'Gold': faCake,
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

    <div class="container mx-auto px-4 py-6">
      <!-- Back Button -->
      <div class="mb-4">
        <Button
          label="Back to Spells"
          @click="goBack"
          severity="primary"
          size="small"
        />
      </div>

      <!-- Main Card -->
      <Card class="spell-card">
        <template #content>
          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div class="flex items-center justify-between">
              <Skeleton height="2rem" width="60%" />
              <Skeleton height="1.5rem" width="4rem" />
            </div>
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="3rem" />
          </div>

          <!-- No Spell Selected -->
          <div v-else-if="!selectedSpell">
            <Message severity="warn" class="mb-4">
              No spell selected. Please go back and select a spell to view its details.
            </Message>
            <Button
              icon="pi pi-arrow-left"
              label="Go to Spells"
              @click="goBack"
              size="small"
            />
          </div>

          <!-- Spell Details -->
          <div v-else class="space-y-6">
            <!-- Header Section -->
            <div class="spell-header">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon :icon="faMagic" class="text-2xl text-purple-600" />
                    <h1 class="text-2xl lg:text-3xl font-bold">{{ selectedSpell.name }}</h1>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                      :value="selectedSpell.type"
                      :severity="getSpellTypeSeverity(selectedSpell.type)"
                      :class="getSpellTypeClass(selectedSpell.type)"
                      class="text-xs px-2 py-1"
                    />
                    <span v-if="selectedSpell.light" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                      <FontAwesomeIcon
                        :icon="getLightIcon(selectedSpell.light)"
                        :class="getLightColor(selectedSpell.light)"
                        class="text-xs"
                      />
                      {{ selectedSpell.light }}
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                      <FontAwesomeIcon
                        :icon="selectedSpell.canBeVerbal ? faVolumeUp : faVolumeMute"
                        :class="selectedSpell.canBeVerbal ? 'text-green-500' : 'text-red-500'"
                        class="text-xs"
                      />
                      {{ selectedSpell.canBeVerbal ? 'Verbal' : 'Non-verbal' }}
                    </span>
                  </div>
                  <div v-if="selectedSpell.incantation" class="incantation-display">
                    <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
                      <FontAwesomeIcon :icon="faFeather" class="text-purple-500 mr-2" />
                      "{{ selectedSpell.incantation }}"
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="effect-section">
              <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
                <FontAwesomeIcon :icon="faCake" class="text-purple-600" />
                Effect
              </h3>
              <p class="text-gray-700 leading-relaxed">{{ selectedSpell.effect }}</p>
            </div>
            <div v-if="selectedSpell.creator" class="creator-section">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <FontAwesomeIcon :icon="faUser" />
                <span><strong>Creator:</strong> {{ selectedSpell.creator }}</span>
              </div>
            </div>

            <!-- Admin Actions -->
            <div v-if="isAdmin" class="admin-actions pt-4 border-t border-gray-200">
              <div class="flex flex-wrap gap-2">
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="showUpdateDialog = true"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  severity="danger"
                  outlined
                  size="small"
                  @click="deleteSpell"
                />
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

.spell-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.spell-card:hover {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
}

.spell-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(103, 126, 234, 0.1);
}

.incantation-display {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 8px;
  padding: 0.75rem;
  border-left: 3px solid #667eea;
  margin-top: 0.75rem;
}

.effect-section {
  background: rgba(103, 126, 234, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #667eea;
}

/* Spell type specific styles */
.spell-charm {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.spell-curse {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: white;
}

.spell-jinx {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: white;
}

.spell-hex {
  background: linear-gradient(135deg, #fd79a8, #6c5ce7);
  color: white;
}

.spell-counter {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
}

.spell-healing {
  background: linear-gradient(135deg, #55a3ff, #a29bfe);
  color: white;
}

.spell-default {
  background: linear-gradient(135deg, #636e72, #2d3436);
  color: white;
}

/* Animations */
.spell-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .spell-header h1 {
    font-size: 1.5rem;
  }

  .incantation-display {
    padding: 0.5rem;
  }

  .effect-section {
    padding: 0.75rem;
  }
}

.dark .p-card .p-card-content span {
  color: black;
}
</style>