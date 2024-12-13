<script lang="ts" setup>
import { getMyUser, type User } from "~/api/users";

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const router = useRouter();

if (import.meta.client) {
  const authStore = useAuthStore();
  token.value = authStore.token as string;

  watch(
    () => authStore.token,
    async (newToken) => {
      if (newToken) {
        user.value = await getMyUser(newToken);
        if (user.value) {
          authStore.fetchUser();
          token.value = newToken;
        }
      } else {
        user.value = null;
        token.value = null;
      }
    }
  );

  user.value = authStore.user as User;
  onMounted(async () => {
    router.beforeEach((_to, _from) => {
      document.body.classList.remove("overflow-hidden");
    });
  });
}
</script>

<template>
  <div>
    <header>
      <div class="">
        <ClientOnly>
          <BNav
            title="SrWither"
            :is-auth="token !== undefined"
            :is-admin="user?.role.toString() === 'roles:admin'"
          />
          <template #fallback>
            <BNav title="SrWither" :is-auth="false" :is-admin="false" />
          </template>
        </ClientOnly>
      </div>
    </header>
    <main class="bg-zinc-950">
      <slot />
    </main>
    <footer
      class="bg-white text-black border-b border-gray-200 transition-all shadow mt-auto"
    >
      <div
        class="container mx-auto px-6 py-4 flex justify-between items-center"
      >
        <p>© 2024 SrWither</p>
        <div class="flex space-x-4">
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style></style>
~/utils/auth~/utils/users
