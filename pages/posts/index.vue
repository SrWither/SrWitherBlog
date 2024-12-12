<script setup lang="ts">
import { getPostsByFilters, type Post } from "~/api/posts";
import { getCategories, type Category } from "~/api/categories";
import type { RecordId } from "surrealdb";

interface Option {
  value: unknown;
  label: string;
}

useHead({
  title: "Nameless | Posts",
  meta: [
    {
      name: "description",
      content: "Explore and discover interesting content",
    },
  ],
});
const posts = useState<Post[]>("posts", () => []);
const filter = ref<string>("");
const category = ref<RecordId | null>(null);
const popup = ref<boolean>(false);
const selectedPost = ref<Post | null>(null);

const categories = useState<Category[]>("categories", () => []);
const optionCategories = ref<Option[]>([]);

const loadPosts = async () => {
  posts.value = await getPostsByFilters(
    category.value?.toString() || "",
    filter.value
  );
  console.log(posts.value);
};

const handleSearch = async () => {
  await loadPosts();
};

const handleInfo = (e: Event, data: Post) => {
  e.preventDefault();
  selectedPost.value = data;
  popup.value = true;
};

onBeforeMount(async () => {
  await loadPosts();
  categories.value = await getCategories();
  optionCategories.value = [
    { label: "All", value: "all" },
    ...categories.value.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];
});

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleString("en-US", options);
};
</script>

<template>
  <div class="h-[calc(100vh-7rem)] transition-all p-6 overflow-scroll">
    <div class="flex flex-col space-y-4">
      <div
        class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center items-center"
      >
        <BInput
          name="filter"
          placeholder="Search"
          type="text"
          v-model="filter"
        />
        <BNewSelect
          name="category"
          label="Category"
          v-model="category"
          :options="optionCategories"
          class=""
        />
        <BBtn label="Search" @click="handleSearch" />
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4"
      >
        <BCard
          v-for="post in posts"
          :key="post.id?.toString()"
          :post="post"
          class="col-span-2"
          @contextmenu="($event) => handleInfo($event, post)"
        />
      </div>
    </div>

    <!--Post details-->
    <Transition name="popup">
      <div
        v-show="popup"
        class="fixed inset-0 z-50 flex justify-center items-center"
        style="
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        "
      >
        <div class="relative m-4 max-w-xl">
          <div class="absolute right-6 top-6 dark:text-white">
            <button @click="popup = false">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 pr-12">
            <h2 class="text-xl font-semibold dark:text-white break-words">
              {{ selectedPost?.title }}
            </h2>
            <p class="text-gray-500 mb-2">
              Updated at:
              {{ formatDate(selectedPost?.updated_at || new Date()) }}
            </p>
            <p class="mb-4 dark:text-gray-300">
              {{ selectedPost?.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1 bg-white text-black rounded-lg text-sm"
                v-for="tag in selectedPost?.tags"
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
            <p class="text-gray-500 mt-4">
              CategoryID: {{ selectedPost?.category }}
            </p>
            <!-- <p class="text-gray-500">User: {{ selectedPost?.user }}</p> -->
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style>
getServerPostsByFiltersgetServerPostsByFilters
