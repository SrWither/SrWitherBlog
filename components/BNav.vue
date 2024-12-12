<script setup lang="ts">
interface Props {
  title: string;
  isAuth: boolean;
  isAdmin: boolean;
}

defineProps<Props>();

const handleLogout = async () => {
  if (import.meta.client) {
    const authStore = useAuthStore();

    authStore.clearToken();
    location.reload();
  }
};
</script>

<template>
  <nav
    class="p-4 flex justify-between items-center shadow-md bg-white text-black border-b border-gray-200"
  >
    <NuxtLink to="/" class="font-bold text-xl">{{ title }}</NuxtLink>
    <div class="flex items-center space-x-4">
      <NuxtLink
        class="flex items-center space-x-2 hover:text-gray-600"
        to="/posts"
      >
        <i class="pi pi-file"></i>
        <span>Posts</span>
      </NuxtLink>

      <!-- Create post -->
      <NuxtLink
        class="flex items-center space-x-2 hover:text-gray-600"
        to="/createpost"
        v-if="isAuth"
      >
        <i class="pi pi-file-plus"></i>
        <span>Create Post</span>
      </NuxtLink>

      <!-- Admin -->
      <NuxtLink
        class="flex items-center space-x-2 hover:text-gray-600"
        to="/admin/categories"
        v-if="isAdmin"
      >
        <i class="pi pi-user-plus"></i>
        <span>Admin</span>
      </NuxtLink>

      <!-- Logout -->
      <button
        class="flex items-center space-x-2 hover:text-gray-600"
        v-if="isAuth"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>

<style>
nav a,
nav button {
  transition: color 0.3s ease;
}
</style>
