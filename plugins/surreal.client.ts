import { initDB } from "~/api/connect";

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("Initializing SurrealDB connection...");
  await initDB();
  const authStore = useAuthStore();
  await authStore.initializeAuth();
});