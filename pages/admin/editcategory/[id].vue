<script setup lang="ts">
import {
  type Category,
  getCategories,
  getCategory,
  updateCategory,
} from "@/api/categories";
import { RecordId } from "surrealdb";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

definePageMeta({
  middleware: "admin",
});

const categories = ref<Category[]>([]);
const editedCategory = ref<Category | null>(null);

const catIdString = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const catIdSplited = catIdString.split(":");
const catId = new RecordId(catIdSplited[0], catIdSplited[1]);

const reloadData = async () => {
  categories.value = await getCategories();
};

onBeforeMount(async () => {
  await reloadData();
  if (catId) {
    editedCategory.value = await getCategory(catId);
  }
});

const handleUpdateCategory = async () => {
  if (authStore.token && editedCategory.value) {
    await updateCategory(authStore.token, catId, editedCategory.value);
    await reloadData();
    editedCategory.value = null;
    router.push(`/admin/categories/${catId}`);
  }
};
</script>

<template>
  <div class="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
    <div class="container mx-auto mt-2 p-4 md:p-6 lg:p-8 bg-zinc-900 rounded-xl">
      <h1 class="text-2xl lg:text-3xl font-bold mb-6 text-white">Edit Category</h1>
      <div
        v-if="editedCategory"
        class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 lg:p-6 space-y-4"
      >
        <BInput
          name="editCategory"
          placeholder="Category name"
          type="text"
          v-model="editedCategory.name"
          class="w-full"
        />
        <BInput
          name="editCategoryDescription"
          placeholder="Category description"
          type="text"
          v-model="editedCategory.description"
          class="w-full"
        />
        <BBtn label="Save" @click="handleUpdateCategory" class="w-full" />
      </div>
    </div>
  </div>
</template>
