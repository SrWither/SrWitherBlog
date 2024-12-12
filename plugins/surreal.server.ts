import { Surreal } from "surrealdb";

export default defineNuxtPlugin(async (nuxtApp) => {
  const sdb = new Surreal();

  const url = useRuntimeConfig().public.ssrSurrealUrl

  console.log(url)

  await sdb.connect(url, {
    namespace: "blog",
    database: "blog",
  });

  console.log("Connected to SurrealDB SSR");

  return {
    provide: {
      sdb,
    },
  };
});
