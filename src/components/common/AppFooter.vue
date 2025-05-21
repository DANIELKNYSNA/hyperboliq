<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template>
  <footer class="bg-gray-800 text-white py-6 mt-12">
    <div class="container mx-auto px-4 text-center">
      <p>{{ props.text }}</p>
    </div>
  </footer>
</template>