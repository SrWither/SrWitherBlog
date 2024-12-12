<script setup lang="ts">
import { login } from "~/api/auth";

const email = ref<string>("");
const password = ref<string>("");

definePageMeta({
  middleware: "auth",
})

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const token = await login(email.value, password.value);
  if (token) {
    authStore.setToken(token);
    router.push("/");
  } else {
    email.value = "";
    password.value = "";
  }
};
</script>

<template>
  <div class="overflow-hidden">
    <!-- Main container with background and theme toggle button -->
    <div
      class="flex justify-center items-center transition-colors"
      style="height: calc(100vh - 7rem)"
    >
      <!-- Login form -->
      <BSimpleCard class="lg:w-full lg:max-w-md w-96">
        <form @submit.prevent="handleLogin">
          <!-- Title -->
          <div class="flex justify-center mb-6">
            <h1 class="text-black text-3xl font-bold">Login</h1>
          </div>

          <!-- Email input -->
          <div class="mb-4">
            <BInputLabel text="Email" style="color: black" />
            <BInput
              type="email"
              name="email"
              v-model="email"
              placeholder="Enter your email"
              style="color: black; background-color: white"
            />
          </div>

          <!-- Password input -->
          <div class="mb-6">
            <BInputLabel text="Password" style="color: black" />
            <BInput
              type="password"
              name="password"
              v-model="password"
              placeholder="Enter your password"
              style="color: black; background-color: white"
            />
          </div>

          <!-- Sign in button -->
          <div class="flex justify-center">
            <BBtn label="Sign in" class="w-full" style="background-color: black; color: white;" />
          </div>
        </form>
      </BSimpleCard>
    </div>
  </div>
</template>
