<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Message from 'primevue/message'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faMagic, faUserTie } from '@fortawesome/free-solid-svg-icons'
 library.add(
  faMagic,
  faUserTie,
  faSearch,
)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useSpellStore } from '@/stores/spellStore'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

// Emits definition
const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const spellStore = useSpellStore()
const updateLoading = ref(false)
const updateError = ref<string | null>(null)
const selectedSpell = computed(() => spellStore.selectedSpell)

// Use computed for the dialog visibility to handle two-way binding
const showUpdateDialog = computed({
  get: () => props.show,
  set: (value: boolean) => emit('update:show', value)
})

const updateForm = ref({
  id: '',
  name: '',
  effect: '',
  incantation: '',
  type: ''
})

const spells = computed(() => spellStore.spells)

const spellTypes = computed(() => {
  const types = [...new Set((spells?.value || []).map(spell => spell.type))]
  return types.map(type => ({ label: type, value: type }))
})

// Watch for changes in selectedSpell and populate form
watch(selectedSpell, (newSpell) => {
  if (newSpell) {
    updateForm.value = {
      id: newSpell.id || '',
      name: newSpell.name || '',
      effect: newSpell.effect || '',
      incantation: newSpell.incantation || '',
      type: newSpell.type || ''
    }
  }
}, { immediate: true })

// Also watch for when dialog opens to ensure form is populated
watch(() => props.show, (isVisible) => {
  if (isVisible && selectedSpell.value) {
    updateForm.value = {
      id: selectedSpell.value.id || '',
      name: selectedSpell.value.name || '',
      effect: selectedSpell.value.effect || '',
      incantation: selectedSpell.value.incantation || '',
      type: selectedSpell.value.type || ''
    }
  }
})

const handleUpdateSpell = () => {
  if (!updateForm.value.id) return
  updateLoading.value = true
  updateError.value = null
  try {
    const spellIndex = spells.value?.findIndex(s => s.id === updateForm.value.id)
    if (spellIndex !== -1 && spells.value) {
      const index = spellIndex as number
      spells.value[index] = {
        ...spells.value[index],
        name: updateForm.value.name,
        effect: updateForm.value.effect,
        incantation: updateForm.value.incantation,
        type: updateForm.value.type
      }
      if (spellStore.selectedSpell && spellStore.selectedSpell.id === updateForm.value.id) {
        spellStore.selectedSpell = spells.value[index]
      }
    }
    closeDialog()
  } catch (err) {
    updateError.value = 'Failed to update spell'
    console.error('Error updating spell:', err)
  } finally {
    updateLoading.value = false
  }
}

const closeDialog = () => {
  showUpdateDialog.value = false
  updateError.value = null
}

const cancelUpdate = () => {
  // Reset form to original values if we have a selected spell
  if (selectedSpell.value) {
    updateForm.value = {
      id: selectedSpell.value.id || '',
      name: selectedSpell.value.name || '',
      effect: selectedSpell.value.effect || '',
      incantation: selectedSpell.value.incantation || '',
      type: selectedSpell.value.type || ''
    }
  }
  closeDialog()
}
</script>

<template>
  <div>
    <!-- Update Spell Dialog -->
    <Dialog
      v-model:visible="showUpdateDialog"
      modal
      header="Update Spell"
      :style="{ width: '50vw', minWidth: '320px' }"
      class="update-spell-dialog"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon :icon="faMagic" class="text-purple-600" />
          <span class="font-bold">Update Spell</span>
        </div>
      </template>

      <div class="space-y-4">
        <Message v-if="updateError" severity="error" class="mb-4">
          {{ updateError }}
        </Message>

        <div v-if="!selectedSpell" class="text-center py-4">
          <Message severity="warn">
            No spell selected. Please select a spell to update.
          </Message>
        </div>

        <template v-else>
          <div class="field">
            <label for="spellName" class="block text-sm font-medium mb-2">
              Spell Name *
            </label>
            <InputText
              id="spellName"
              v-model="updateForm.name"
              class="w-full"
              placeholder="Enter spell name"
              :disabled="updateLoading"
            />
          </div>

          <div class="field">
            <label for="spellIncantation" class="block text-sm font-medium mb-2">
              Incantation
            </label>
            <InputText
              id="spellIncantation"
              v-model="updateForm.incantation"
              class="w-full"
              placeholder="Enter incantation"
              :disabled="updateLoading"
            />
          </div>

          <div class="field">
            <label for="spellType" class="block text-sm font-medium mb-2">
              Type *
            </label>
            <Dropdown
              id="spellType"
              v-model="updateForm.type"
              :options="spellTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select spell type"
              class="w-full"
              :disabled="updateLoading"
            />
          </div>

          <div class="field">
            <label for="spellEffect" class="block text-sm font-medium mb-2">
              Effect *
            </label>
            <Textarea
              id="spellEffect"
              v-model="updateForm.effect"
              class="w-full"
              rows="4"
              placeholder="Describe the spell's effect"
              :disabled="updateLoading"
            />
          </div>
        </template>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="cancelUpdate"
            severity="secondary"
            outlined
            :disabled="updateLoading"
          />
          <Button
            label="Update Spell"
            icon="pi pi-check"
            @click="handleUpdateSpell"
            :loading="updateLoading"
            :disabled="!updateForm.name || !updateForm.effect || !updateForm.type || !selectedSpell"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.update-spell-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.update-spell-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.update-spell-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}
</style>