<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const router = useRouter();
</script>

<template>
  <NuxtLayout>
    <div
      class="flex justify-center items-center flex-col space-y-4 bg-black h-[calc(100vh-7.5rem)]"
    >
      <h1 class="font-bold text-9xl text-white">{{ error?.statusCode }}</h1>
      <p class="text-white">{{ error?.statusMessage }}</p>
      <BBtn label="Home" @click="router.push('/')" class="bg-" />
    </div>
  </NuxtLayout>
</template>
