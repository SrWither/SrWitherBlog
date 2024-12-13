<script setup lang="ts">
import { type Post } from "~/api/posts";
import {
  getCategory,
  type Category,
  getServerCategory,
} from "~/api/categories";

interface Props {
  post: Post;
}

const props = defineProps<Props>();
const router = useRouter();

const imageApi = useRuntimeConfig().public.imageUrl;

const category = useState<Category | null>("category", () => null);

if (import.meta.server) {
  await callOnce(async () => {
    category.value = await getServerCategory(props.post.category);
  });
}

if (import.meta.client) {
  await callOnce(async () => {
    category.value = await getCategory(props.post.category);
  });
}

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

const handlePostClick = () => {
  router.push(`/posts/${props.post.id}`);
};

const processImageSrc = (src: string): string => {
  if (src.startsWith("srwither_")) {
    const imageId = src.replace("srwither_", "");
    return `${imageApi}/api/v1/${imageId}`;
  }
  return src;
};
</script>

<template>
  <div
    class="relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-transform overflow-hidden cursor-pointer h-full"
    @click="handlePostClick"
  >
    <!-- Imagen destacada -->
    <div class="relative h-40 bg-gray-200">
      <img
        v-if="props.post.image"
        :src="processImageSrc(props.post.image)"
        alt="Post image"
        class="w-full h-full object-cover"
      />
      <div
        v-if="category"
        class="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full"
      >
        {{ category?.name }}
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="p-5 flex flex-col gap-3 flex-grow">
      <h1 class="text-lg font-bold text-gray-800 leading-snug line-clamp-2">
        {{ props.post.title }}
      </h1>
      <p class="text-sm text-gray-600 line-clamp-3">
        {{
          props.post.description.length > 150
            ? props.post.description.substring(0, 150) + "..."
            : props.post.description
        }}
      </p>
    </div>

    <!-- Pie de la tarjeta -->
    <div
      class="p-4 bg-gray-100 flex justify-between items-center text-sm text-gray-600 mt-auto"
    >
      <p>{{ formatDate(props.post.created_at || new Date()) }}</p>
      <p
        v-if="!props.post.published"
        class="bg-red-500 text-white px-2 py-1 rounded-full"
      >
        Unpublished
      </p>
    </div>
  </div>
</template>
