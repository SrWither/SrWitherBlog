<script setup lang="ts">
import { getPost, getServerPost, type Post } from "@/api/posts";
import { type User, getMyUser } from "@/api/users";
import { RecordId } from "surrealdb";

const route = useRoute();
const router = useRouter();

const postIdString = route.params.id as string;
const postIdSplited = postIdString.split(":");
const postId = new RecordId(postIdSplited[0], postIdSplited[1]);

const user = ref<User | null>(null);
const post = useState<Post>("post", () => ({
  id: new RecordId("", ""),
  title: "",
  content: "",
  tags: [],
  published: false,
  user: new RecordId("", ""),
  updated_at: new Date(),
  category: new RecordId("", ""),
  description: "",
}));

const showLightbox = ref<boolean>(false);
const lightboxImageUrl = ref<string>("");

if (import.meta.server) {
  await callOnce(async () => {
    const postData = await getServerPost(postId);
    console.log(postData);
    if (!postData) {
      router.push("/404");
      return;
    }

    Object.assign(post.value, postData);
  });
}

onBeforeMount(async () => {
  if (import.meta.client) {
    const authStore = useAuthStore();
    user.value = await getMyUser(authStore.token || "");
    if (postId) {
      const postData = await getPost(postId);
      if (!postData) {
        router.push("/404");
        return;
      }

      Object.assign(post.value, postData);
    }
    useHead({
      title: `Nameless | ${post.value.title}`,
      meta: [
        {
          name: "description",
          content: post.value.description,
        },
      ],
    });
  }
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

const canEditPost = computed(() => {
  return (
    user.value &&
    (post.value.user?.toString() === user.value.id.toString() ||
      user.value.role.toString() === "roles:admin")
  );
});

const handleLightbox = (imageUrl: string) => {
  lightboxImageUrl.value = imageUrl;
  document.body.classList.add("overflow-hidden");
  showLightbox.value = true;
};

const closeLightbox = () => {
  showLightbox.value = false;
  document.body.classList.remove("overflow-hidden");
  lightboxImageUrl.value = "";
};

useHead({
  title: `Nameless | ${post.value.title}`,
  meta: [
    {
      name: "description",
      content: post.value.description,
    },
  ],
});

onUnmounted(() => {
  post.value = {
    id: new RecordId("", ""),
    title: "",
    content: "",
    tags: [],
    published: false,
    user: new RecordId("", ""),
    updated_at: new Date(),
    category: new RecordId("", ""),
    description: "",
  };
});
</script>

<template>
  <div
    id="post-container"
    class="bg-gray-100 p-4 sm:p-6 dark:bg-zinc-900 dark:text-white min-h-screen transition-all"
  >
    <div class="py-4 sm:py-6 shadow-lg relative mx-auto bg-zinc-800 rounded-xl">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center break-words px-32">
        {{ post.title }}
      </h1>

      <div class="flex justify-center mb-4 absolute top-4 left-4">
        <router-link v-if="canEditPost" :to="`/editpost/${postId}`">
          <BBtn label="Edit Post" />
        </router-link>
      </div>
      <!-- <div class="flex justify-center mb-4 absolute top-4 right-4">
        <BBtn v-if="canEditPost" label="Delete Post" />
      </div> -->
      <p class="mb-2 text-center text-zinc-300">Author: {{ user?.username }}</p>
      <p class="mb-2 text-center text-zinc-500">
        {{ formatDate(post.updated_at || new Date()) }}
      </p>

      <div class="flex justify-center mb-4 flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 bg-white text-black rounded-lg text-sm"
        >
          {{ tag }}
        </span>
      </div>

      <div class="px-2 sm:px-4 md:px-10 lg:px-20 text-lg">
        <div
          v-if="!post.published"
          class="text-red-600 font-semibold text-center mb-4"
        >
          <i class="pi pi-times"></i> Not Published
        </div>
        <div class="text-[1rem]">
          <BMarkdown :content="post.content" @click-image="handleLightbox" />
        </div>
      </div>
    </div>

    <!--Image lightbox-->
    <transition name="lightbox">
      <div
        v-if="showLightbox"
        class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 lg:p-10"
      >
        <div class="max-w-full max-h-full flex">
          <i
            class="pi pi-times text-white text-2xl absolute top-4 right-4 cursor-pointer"
            @click="closeLightbox"
          ></i>
          <img
            :src="lightboxImageUrl"
            alt="lightbox image"
            class="object-contain lg:object-scale-down max-w-full max-h-full rounded-lg"
            v-motion
            :initial="{ opacity: 1, scale: 0 }"
            :enter="{ opacity: 1, scale: 1 }"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.1s;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
