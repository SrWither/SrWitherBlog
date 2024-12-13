<script setup lang="ts">
import { type User } from "~/api/users";
import { type Post, getLastsPosts, getServerLastsPosts } from "~/api/posts";

const user = ref<User | null>(null);
const posts = useState<Post[]>("posts", () => []);

if (import.meta.server) {
  await callOnce(async () => {
    posts.value = await getServerLastsPosts();
  });
}

if (import.meta.client) {
  const userStore = UserStore();
  user.value = userStore.user;
  posts.value = await getLastsPosts();
}

useHead({
  title: "SrWither",
  meta: [
    {
      name: "description",
      content: "Welcome to SrWither's Blog",
    },
  ],
});
</script>

<template>
  <div
    class="min-h-screen transition-all"
    style="min-height: calc(100vh - 7.4rem)"
  >
    <!-- Hero Section -->
    <header class="bg-cover bg-center h-96">
      <div
        class="flex items-center justify-center h-full w-full bg-zinc-900 text-white"
      >
        <div class="text-center">
          <h1 class="text-4xl font-bold" v-if="user">
            ¡Welcome {{ user.username }}!
          </h1>
          <h1 class="text-4xl font-bold" v-else>Welcome to SrWither's Blog</h1>
          <p class="text-lg mt-4">Explore and discover interesting content</p>
        </div>
      </div>
    </header>
    <!-- Last Posts Section -->
    <section id="posts" class="container mx-auto px-6 py-12">
      <h2
        class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8"
      >
        Latest posts
      </h2>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <BCard v-for="post in posts" :key="post.id?.toString()" :post="post" />
      </div>
    </section>
  </div>
</template>
