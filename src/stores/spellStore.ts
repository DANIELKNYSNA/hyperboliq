// stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SpellInterface } from '@/interfaces/spell'

export const useSpellStore = defineStore('spellStore', () => {
  const spells = ref<SpellInterface[] | null>(null)
  const selectedSpell = ref<SpellInterface | null>(null)
  const likedSpells = ref<SpellInterface[]>([])

  const deleteSpell = (spellId: string): void => {
    if (!spells.value) return
    spells.value = spells.value.filter(spell => spell.id !== spellId)
    if (selectedSpell.value?.id === spellId) {
      selectedSpell.value = null
    }
  }

  return {
    spells,
    selectedSpell,
    likedSpells,
    deleteSpell
  }
},
{
  persist: true
}
)