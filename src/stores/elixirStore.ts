// stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ElixirInterface } from '@/interfaces/elixirs'

export const useElixirStore = defineStore('elixirStore', () => {
  const elixirs = ref<ElixirInterface[] | null>(null)
  const selectedElixir = ref<ElixirInterface | null>(null)
  const likedElixirs = ref<ElixirInterface[]>([])

  const deleteElixir = (elixirId: string): void => {
    if (!elixirs.value) return
    elixirs.value = elixirs.value.filter(elixir => elixir.id !== elixirId)
    if (selectedElixir.value?.id === elixirId) {
      selectedElixir.value = null
    }
  }

  const createElixir = (elixir: ElixirInterface): void => {
    if (!elixirs.value) {
      elixirs.value = [elixir]
    } else {
      elixirs.value = [elixir, ...elixirs.value]
    }
    if (!selectedElixir.value) {
      selectedElixir.value = elixir
    }
  }

  return {
    elixirs,
    selectedElixir,
    likedElixirs,
    deleteElixir,
    createElixir
  }
},
{
  persist: true
}
)
