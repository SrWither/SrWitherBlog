<script setup lang="ts">
interface Props {
  label: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <button
    v-if="!disabled"
    class="px-4 bg-white text-black font-bold py-2 rounded-xl focus:outline-none focus:ring focus:ring-zinc-500"
  >
    {{ label }}
  </button>
  <button
    v-else
    disabled
    class="px-4 bg-gray-200 text-black font-bold py-2 rounded-xl focus:outline-none focus:ring focus:ring-zinc-500"
  >
    {{ label }}
  </button>
</template>
