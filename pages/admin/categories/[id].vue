<script setup lang="ts">
import { type Category, getCategory } from "@/api/categories";
import { RecordId } from "surrealdb";

const category = ref<Category | null>(null);
const route = useRoute();
const router = useRouter();

definePageMeta({
  middleware: "admin",
});

onBeforeMount(async () => {
  const catIdString = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  const catIdSplited = catIdString.split(":");
  const catId = new RecordId(catIdSplited[0], catIdSplited[1]);
  category.value = await getCategory(catId);
});
</script>

<template>
  <div class="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
    <div class="w-96">
      <BSimpleCard class="relative p-4">
        <div class="absolute right-6">
          <button @click="router.back()">
            <i class="pi pi-arrow-left"></i>
          </button>
        </div>
        <div v-if="category" class="flex flex-col">
          <h2 class="text-2xl font-bold mb-4">Category Details</h2>
          <p class="mb-2">
            <span class="font-semibold">ID:</span> {{ category.id }}
          </p>
          <p class="mb-2">
            <span class="font-semibold">Name:</span> {{ category.name }}
          </p>
          <p class="mb-4">
            <span class="font-semibold">Description:</span>
            {{ category.description }}
          </p>
          <RouterLink :to="`/admin/editcategory/${category.id || ''}`">
            <BBtn label="Edit" class="w-full " style="color: white; background-color: black;"/>
          </RouterLink>
        </div>
      </BSimpleCard>
    </div>
  </div>
</template>
